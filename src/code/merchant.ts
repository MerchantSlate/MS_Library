import { ChainIds, ErrorResponse } from "../types";
import { getChainsData } from "./config";
import { errorResponse } from "./contract";
import { fromWei, getContract } from "./methods";
import { processNumbers } from "./showcase";

const
    /** Merchant Fee Value Text */
    merchantFeeValueText = async (
        chain: ChainIds,
    ): Promise<string | ErrorResponse | undefined> => {
        try {
            const
                chainsData = getChainsData(),
                symbol = chainsData[chain]?.nativeCurrency?.symbol,
                value = await merchantFee(chain);
            if (typeof value == `string`)
                return `${symbol} ${processNumbers(fromWei(value, 18))}`
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