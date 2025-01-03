import { ChainIds, ErrorResponse } from "../types";
declare const 
/** Merchant Fee Value Text */
merchantFeeValueText: (chain: ChainIds) => Promise<string | ErrorResponse | undefined>, 
/** Merchant Fee */
merchantFee: (chain: ChainIds) => Promise<string | ErrorResponse | undefined>, 
/** Merchant Signup */
merchantSignup: (chain: ChainIds) => Promise<{
    hash?: string;
    merchantId?: string;
} | ErrorResponse | undefined>, 
/** Merchant Id */
getMerchantId: (chain: ChainIds) => Promise<string | ErrorResponse | undefined>;
export { merchantFeeValueText, merchantFee, merchantSignup, getMerchantId, };
