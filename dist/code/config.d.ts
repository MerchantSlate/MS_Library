import { SupportedChainsData } from "../types";
declare const 
/** Get updated chains data */
getChainsData: () => SupportedChainsData, 
/** Get updated configuration */
getConfig: () => {
    browserWallet: string;
    walletPrivateKey: string;
    walletSeedPhrase: string;
    merchantSlateContract: string;
}, config: ({ browserWallet, walletPrivateKey, walletSeedPhrase, ARBITRUM_RPC, AVALANCHE_RPC, APT_RPC, BSC_RPC, CELO_RPC, ETH_RPC, FANTOM_RPC, OPTIMISM_RPC, POLYGON_RPC, billionSuffix, millionSuffix, merchantSlateContract, }: {
    /** browser extension wallet */
    browserWallet?: string;
    /** wallet private key (optional) */
    walletPrivateKey?: string;
    /**
     * wallet seed phrase (optional)
     *
     * cannot be used if private key is defined
     */
    walletSeedPhrase?: string;
    /** ARBITRUM RPC URL */
    ARBITRUM_RPC?: string;
    /** AVALANCHE RPC URL */
    AVALANCHE_RPC?: string;
    /** APT RPC URL */
    APT_RPC?: string;
    /** BSC RPC URL */
    BSC_RPC?: string;
    /** CELO RPC URL */
    CELO_RPC?: string;
    /** ETH RPC URL */
    ETH_RPC?: string;
    /** FANTOM RPC URL */
    FANTOM_RPC?: string;
    /** OPTIMISM RPC URL */
    OPTIMISM_RPC?: string;
    /** POLYGON RPC URL */
    POLYGON_RPC?: string;
    /** billion number suffix */
    billionSuffix?: string;
    /** million number suffix */
    millionSuffix?: string;
    /** MerchantSlate Contract Address (does not require change) */
    merchantSlateContract?: string;
}) => void;
export { getChainsData, getConfig, config, };
