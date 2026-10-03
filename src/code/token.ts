import { ZeroAddress } from "ethers/constants";
import { ChainIds, EVMAddress, TokenData, TokenDataExtended, TokenDataExtendedObj, TokenDataRaw, TokenLogoParams, TokenRateObj } from "../types";
import { readCache, saveCache } from "./cache";
import { getChainsData, getConfig } from "./config";
import { ZERO_ADDRESS } from "./contract";
import { decimalFactor, divideNumbers, getContract } from "./methods";

const
    tokensDataKey = `tokensData`,
    tokensRateKey = `tokensRate`;

let
    /** Tokens Data Cache */
    tokensDataCache: TokenDataExtendedObj = readCache(tokensDataKey),
    /** Tokens Rate Cache */
    tokensRateCache: TokenRateObj = readCache(tokensRateKey);

const
    tokenDataLimit = 36e5 * 5,
    setTokensDataCache = (data: TokenDataExtendedObj) => {
        tokensDataCache = data;
        saveCache(tokensDataKey, data);
    },
    tokenRateLimit = 6e4,
    setTokensRateCache = (data: TokenRateObj) => {
        tokensRateCache = data;
        saveCache(tokensRateKey, data);
    },
    /** Token Data Convert */
    tokenDataConvert = (
        chain: ChainIds,
        tokenDataRaw: TokenDataRaw
    ): TokenData => {
        let symbol = tokenDataRaw?.[2];
        if (symbol == `native`)
            symbol = getChainsData()[chain]?.nativeCurrency?.symbol;
        return {
            address: tokenDataRaw?.[0],
            name: tokenDataRaw?.[1],
            symbol,
            decimals: +tokenDataRaw?.[3]?.toString(),
        }
    },
    /** Resolve a token logo via the custom resolver */
    resolveTokenLogo = async ({
        chain,
        tokenAddress,
    }: TokenLogoParams): Promise<string | undefined> => {
        try {
            return await getConfig().getTokenLogo?.(chain, tokenAddress);
        } catch (e) { };
    },
    /** Token Data (onchain) */
    tokenOnchainData = async (
        chain: ChainIds,
        tokenAddress: EVMAddress,
    ): Promise<TokenData | undefined> => {
        try {
            if (tokenAddress == ZeroAddress) {
                const nativeCurrency = getChainsData()
                    ?.[chain]
                    ?.nativeCurrency;
                return {
                    address: tokenAddress,
                    ...nativeCurrency,
                };
            };
            const contract = await getContract(chain);
            return tokenDataConvert(
                chain,
                await contract.getTokenData(tokenAddress)
            )
        } catch (e) {
            return
        };
    },
    /** Token Data */
    getTokenData = async (
        chain: ChainIds,
        tokenAddress: EVMAddress,
        skipLogo: boolean = false,
    ): Promise<TokenDataExtended | undefined> => {
        try {

            // convert address
            tokenAddress =
                (tokenAddress || ``)?.toLowerCase() as EVMAddress
                || ZERO_ADDRESS;

            // check cached
            tokensDataCache[chain] = tokensDataCache[chain] || {};
            const cached = tokensDataCache[chain][tokenAddress];
            if (
                cached?.updateTime
                && cached.updateTime > (Date.now() - tokenDataLimit)
            ) return cached.data;

            const
                nativeToken = getChainsData()[chain].nativeCurrency,
                nativeLogo = chain == `ARBITRUM` || chain == `OPTIMISM` ?
                    getChainsData().ETH.logo
                    : getChainsData()[chain].logo;

            // check native
            if (tokenAddress == ZERO_ADDRESS) {
                return {
                    logo: nativeLogo,
                    symbol: nativeToken.symbol,
                    name: nativeToken.name,
                    decimals: nativeToken.decimals,
                    address: tokenAddress,
                }
            };

            // get data
            const
                [logo, onchainData] = await Promise.all([
                    skipLogo
                        ? nativeLogo
                        : resolveTokenLogo({ chain, tokenAddress }),
                    tokenOnchainData(chain, tokenAddress),
                ]);
            if (onchainData) {
                const tokenDataObj: TokenDataExtended = {
                    ...onchainData,
                    logo: logo || nativeLogo,
                };
                tokensDataCache[chain][tokenAddress] = {
                    updateTime: Date.now(),
                    data: tokenDataObj,
                };
                setTokensDataCache(tokensDataCache);
                return tokenDataObj
            };
        } catch (error: any) {
            return
        };
    },
    /** Token Rate in Ref. Token (Default Ref.: USDT) */
    getTokenRate = async ({
        chain,
        tokenAddress,
        referenceAddress,
        referenceDecimals,
    }: {
        chain: ChainIds,
        tokenAddress: EVMAddress,
        referenceAddress?: EVMAddress,
        referenceDecimals?: number,
    }): Promise<number> => {
        try {

            // check cached
            tokensRateCache[chain] = tokensRateCache[chain] || {};
            const
                rateKey = `${tokenAddress}_${referenceAddress || ``}`,
                cached = tokensRateCache[chain][rateKey];
            if (
                cached?.updateTime
                && cached.updateTime > (Date.now() - tokenRateLimit)
                && cached.data
            ) return cached.data;

            const
                contract = await getContract(chain),
                USDT = getChainsData()?.[chain]?.USDT,
                referenceBaseWei = decimalFactor(
                    referenceAddress ? (referenceDecimals || 18)
                        : USDT?.decimals
                )?.toString(),
                rateWei = (
                    await contract.tokenRate(
                        // optimism exception - wrapped ETH address
                        chain == `OPTIMISM` && tokenAddress == ZERO_ADDRESS ?
                            `0x4200000000000000000000000000000000000006`
                            : tokenAddress,
                        referenceBaseWei,
                        referenceAddress || USDT?.address
                    )
                )?.toString(),
                rate = divideNumbers(rateWei, referenceBaseWei);
            tokensRateCache[chain][rateKey] = {
                updateTime: Date.now(),
                data: rate,
            };
            setTokensRateCache(tokensRateCache);
            return rate
        } catch (e) {
            return 0
        };
    };

export {
    getTokenData,
    tokenOnchainData,
    getTokenRate,
};