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
}, config: ({ browserWallet, walletPrivateKey, walletSeedPhrase, ARBITRUM_RPC, AVALANCHE_RPC, APT_RPC, BSC_RPC, CELO_RPC, ETH_RPC, FANTOM_RPC, OPTIMISM_RPC, POLYGON_RPC, billionSuffix, millionSuffix, merchantSlateContract, consoleLogEnabled, }: MerchantConfigParams) => void;
export { getChainsData, getConfig, config, };
