import { ChainIds, EVMAddress, TokenData, TokenDataExtended, TokenDataRaw } from "../types";
import { getChainsData } from "./config";
import { ZERO_ADDRESS } from "./contract";
import { getContract } from "./methods";

const
    /** Tokens Data Cache */
    tokensDataCache: {
        [chain: string]: {
            [token: string]: TokenDataExtended
        }
    } = (() => {
        try {
            return localStorage.tokensDataCache ?
                JSON.parse(localStorage.tokensDataCache)
                : {};
        } catch (e) {
            return {};
        };
    })(),
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
    /** Token Data (onchain) */
    tokenOnchainData = async (
        chain: ChainIds,
        tokenAddress: EVMAddress,
    ): Promise<TokenData | undefined> => {
        try {
            const contract = await getContract(chain);
            return tokenDataConvert(
                chain,
                await contract.getTokenData(tokenAddress)
            )
        } catch (e) {
            return
        };
    },
    /** Token Logo (CoinGecko) */
    getTokenLogo = async (
        chain: ChainIds,
        tokenAddress: EVMAddress,
    ): Promise<string | undefined> => {
        const
            response = await fetch(
                `https://api.coingecko.com/api/v3/coins/`
                + `${getChainsData()[chain].coingeckoId}/contract/${tokenAddress}`
            ),
            data = await response?.json();
        return data?.image?.large
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
            if (tokensDataCache[chain][tokenAddress])
                return tokensDataCache[chain][tokenAddress];

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
                logo = (
                    skipLogo ? nativeLogo : await getTokenLogo(
                        chain,
                        tokenAddress
                    )
                ) || nativeLogo,
                onchainData = await tokenOnchainData(chain, tokenAddress);
            if (onchainData) {
                const tokenDataObj: TokenDataExtended = {
                    ...onchainData,
                    logo,
                };
                tokensDataCache[chain][tokenAddress] = tokenDataObj;
                localStorage.tokensDataCache = JSON.stringify(tokensDataCache);
                return tokenDataObj
            };
        } catch (error: any) {
            return
        };
    };

export {
    getTokenLogo,
    getTokenData,
    tokenOnchainData,
};