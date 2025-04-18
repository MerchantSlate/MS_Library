import chainsDataJSON from "../data/chains_data.json";
import { merchantSlateContract } from "../data/contract_address.json";
import { MerchantConfigParams, SupportedChainsData } from "../types";
import { configLargeSuffix } from "./showcase";

const
    /** Public RPCs obtained from https://chainlist.org/ and should only be used for testing */
    chainsData = chainsDataJSON as SupportedChainsData,
    /** Get updated chains data */
    getChainsData = () => chainsData,
    /** Merchant Slate configuration */
    configuration = {
        browserWallet: ``,
        walletPrivateKey: ``,
        walletSeedPhrase: ``,
        merchantSlateContract,
        consoleLogEnabled: true,
    },
    /** Get updated configuration */
    getConfig = () => configuration,
    config = ({
        browserWallet,
        walletPrivateKey,
        walletSeedPhrase,
        ARBITRUM_RPC,
        AVALANCHE_RPC,
        APT_RPC,
        BSC_RPC,
        CELO_RPC,
        ETH_RPC,
        FANTOM_RPC,
        OPTIMISM_RPC,
        POLYGON_RPC,
        billionSuffix,
        millionSuffix,
        merchantSlateContract,
        consoleLogEnabled,
    }: MerchantConfigParams) => {
        // update wallet
        if (browserWallet) configuration.browserWallet = browserWallet;
        if (walletSeedPhrase) configuration.walletSeedPhrase = walletSeedPhrase;
        if (walletPrivateKey) configuration.walletPrivateKey = walletPrivateKey;

        // update RPCs
        if (ARBITRUM_RPC) chainsData.ARBITRUM.rpcUrls[0] = ARBITRUM_RPC;
        if (AVALANCHE_RPC) chainsData.AVALANCHE.rpcUrls[0] = AVALANCHE_RPC;
        if (APT_RPC) chainsData.APT.rpcUrls[0] = APT_RPC;
        if (BSC_RPC) chainsData.BSC.rpcUrls[0] = BSC_RPC;
        if (CELO_RPC) chainsData.CELO.rpcUrls[0] = CELO_RPC;
        if (ETH_RPC) chainsData.ETH.rpcUrls[0] = ETH_RPC;
        if (FANTOM_RPC) chainsData.FANTOM.rpcUrls[0] = FANTOM_RPC;
        if (OPTIMISM_RPC) chainsData.OPTIMISM.rpcUrls[0] = OPTIMISM_RPC;
        if (POLYGON_RPC) chainsData.POLYGON.rpcUrls[0] = POLYGON_RPC;

        // large numbers suffix
        configLargeSuffix({
            billions: billionSuffix,
            millions: millionSuffix,
        });

        // update contract
        if (merchantSlateContract)
            configuration.merchantSlateContract = merchantSlateContract;

        // contract errors log
        if (consoleLogEnabled != undefined)
            configuration.consoleLogEnabled = consoleLogEnabled;
    };

export {
    getChainsData,
    getConfig,
    config,
};