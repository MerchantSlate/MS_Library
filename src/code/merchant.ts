import { ChainIds, ResultPromise, StringObjObj } from "../types";
import { readCache, saveCache } from "./cache";
import { getChainsData } from "./config";
import { ZERO_ADDRESS, errorResponse, processTxHash } from "./contract";
import { fromWei, getContract, getWalletAddress, multiplyNumbers } from "./methods";
import { processNumbers } from "./showcase";
import { getTokenRate } from "./token";

const merchantIdCacheKey = `merchantIdCache`;

/** merchantId Cache */
let merchantIdCache: {
    [walletAddress: string]: {
        [chain: string]: string
    }
} = readCache(merchantIdCacheKey);

const
    merchantIdCacheSave = (data: StringObjObj) => {
        merchantIdCache = data;
        saveCache(merchantIdCacheKey, data)
    },
    /** Merchant Fee */
    merchantFee = async (
        chain: ChainIds,
    ): ResultPromise<string> => {
        try {
            const
                contract = await getContract(chain),
                data = (await contract.MerchantFee())?.toString();
            if (typeof data != `string`) throw data;
            return { success: true, data };
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Merchant Fee Value Text */
    merchantFeeValueText = async (
        chain: ChainIds,
    ): ResultPromise<string> => {
        try {
            const merchantFeeRes = await merchantFee(chain);
            if (!merchantFeeRes?.success) return merchantFeeRes;

            const
                symbol = getChainsData()[chain]?.nativeCurrency?.symbol,
                value = merchantFeeRes.data,
                weiAmount = value?.toString(),
                coinAmount = fromWei(weiAmount || `0`, 18),
                usdRate = await getTokenRate({
                    chain,
                    tokenAddress: ZERO_ADDRESS,
                }) || `0`,
                usdValue = multiplyNumbers(usdRate, coinAmount),
                data = `${symbol} ${processNumbers(coinAmount)} ~ $${processNumbers(usdValue)}`;
            return { success: true, data };
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Merchant Id */
    getMerchantId = async (
        chain: ChainIds
    ): ResultPromise<string> => {
        try {
            const
                contract = await getContract(chain, true),
                address = await getWalletAddress(chain) || `0x`;

            // check cache
            merchantIdCache[address] = merchantIdCache[address] || {};
            const merchantIdCached = merchantIdCache[address][chain];
            if (merchantIdCached) {
                const data = merchantIdCached;
                return { success: true, data };
            };

            const data = (await contract.getMerchantId())?.toString();
            if (typeof data != `string`) throw data
            merchantIdCache[address][chain] = data;
            merchantIdCacheSave(merchantIdCache);
            return { success: true, data };
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Merchant Signup */
    merchantSignup = async (
        chain: ChainIds,
    ): ResultPromise<{ hash?: string, merchantId?: string }> => {
        try {

            // merchant fee
            const
                contract = await getContract(chain, true),
                merchantFeeRes = await merchantFee(chain);
            if (!merchantFeeRes?.success) return merchantFeeRes;

            // signup process
            const
                value = merchantFeeRes.data,
                tx = await contract.merchantSignup({ value }),
                hashRes = await processTxHash(tx);
            if (!hashRes?.success) return hashRes;

            // merchant id
            const merchantIdRes = await getMerchantId(chain);
            if (!merchantIdRes?.success) return merchantIdRes;

            const
                hash = hashRes.data,
                merchantId = merchantIdRes.data,
                data = { hash, merchantId };
            return { success: true, data }
        } catch (error: any) {
            return errorResponse(error);
        };
    };

export {
    merchantFee,
    merchantFeeValueText,
    getMerchantId,
    merchantSignup,
};