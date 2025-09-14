import { MerchantConfigParams, SupportedChainsData } from "../types";
declare const 
/** Get updated chains data */
getChainsData: () => SupportedChainsData, 
/** Get updated configuration */
getConfig: () => {
    browserWallet: string;
    walletPrivateKey: string;
    walletSeedPhrase: string;
    merchantSlateContract: string;
    consoleLogEnabled: boolean;
}, config: (data?: MerchantConfigParams) => void;
export { getChainsData, getConfig, config, };
