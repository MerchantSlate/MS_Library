import { ChainIds, ErrorResponse } from "../types";
import { getChainsData } from "./config";
import { ZERO_ADDRESS, errorResponse } from "./contract";
import { fromWei, getContract } from "./methods";
import { processNumbers } from "./showcase";
import { getTokenRate } from "./token";

const
    /** Merchant Fee Value Text */
    merchantFeeValueText = async (
        chain: ChainIds,
    ): Promise<string | ErrorResponse | undefined> => {
        try {
            const value = await merchantFee(chain);
            if (typeof value != `string`) return value;
            const
                symbol = getChainsData()[chain]?.nativeCurrency?.symbol,
                weiAmount = value?.toString(),
                amount = fromWei(weiAmount || `0`, 18),
                usdValue = await getTokenRate({
                    chain,
                    tokenAddress: ZERO_ADDRESS,
                    weiAmount,
                }) || 0;
            return `${symbol} ${processNumbers(amount)} ~ $${processNumbers(usdValue)}`;
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Merchant Fee */
    merchantFee = async (
        chain: ChainIds,
    ): Promise<string | ErrorResponse | undefined> => {
        try {
            const contract = await getContract(chain)
            return (await contract.MerchantFee())?.toString();
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Merchant Signup */
    merchantSignup = async (
        chain: ChainIds,
    ): Promise<
        { hash?: string, merchantId?: string }
        | ErrorResponse
        | undefined
    > => {
        try {
            const
                contract = await getContract(chain, true),
                value = await merchantFee(chain);
            if (typeof value != `string`) return value;
            const
                tx = await contract.merchantSignup({ value }),
                hash = (await tx?.wait())?.hash,
                merchantId = await getMerchantId(chain);
            if (typeof merchantId != `string`) return merchantId
            return { hash, merchantId }
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Merchant Id */
    getMerchantId = async (
        chain: ChainIds
    ): Promise<
        string
        | ErrorResponse
        | undefined
    > => {
        try {
            const
                contract = await getContract(chain, true),
                merchantId = (await contract.getMerchantId())?.toString();
            return merchantId;
        } catch (error: any) {
            return errorResponse(error);
        };
    };

export {
    merchantFeeValueText,
    merchantFee,
    merchantSignup,
    getMerchantId,
};