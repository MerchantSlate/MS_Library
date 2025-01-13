import { ChainIds, ResultPromise } from "../types";
declare const 
/** Merchant Fee */
merchantFee: (chain: ChainIds) => ResultPromise<string>, 
/** Merchant Fee Value Text */
merchantFeeValueText: (chain: ChainIds) => ResultPromise<string>, 
/** Merchant Id */
getMerchantId: (chain: ChainIds) => ResultPromise<string>, 
/** Merchant Signup */
merchantSignup: (chain: ChainIds) => ResultPromise<{
    hash?: string;
    merchantId?: string;
}>;
export { merchantFee, merchantFeeValueText, getMerchantId, merchantSignup, };
