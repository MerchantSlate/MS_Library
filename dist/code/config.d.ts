import { MerchantConfigBasics, MerchantConfigParams, SupportedChainsData } from "../types";
declare const 
/** Get updated chains data */
getChainsData: () => SupportedChainsData, 
/** Get updated configuration */
getConfig: () => MerchantConfigBasics, config: (data?: MerchantConfigParams) => void;
export { getChainsData, getConfig, config, };
