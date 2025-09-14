import chainsDataJSON from "../data/chains_data.json";
import { merchantSlateContract } from "../data/contract_address.json";
import { MerchantConfigParams, SUPPORTED_CHAINS, SupportedChainsData } from "../types";
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
    config = (data: MerchantConfigParams = {}) => {
        const {
            browserWallet,
            walletPrivateKey,
            walletSeedPhrase,
            billionSuffix,
            millionSuffix,
            merchantSlateContract,
            consoleLogEnabled,
        } = data;
        // update wallet
        if (browserWallet) configuration.browserWallet = browserWallet;
        if (walletSeedPhrase) configuration.walletSeedPhrase = walletSeedPhrase;
        if (walletPrivateKey) configuration.walletPrivateKey = walletPrivateKey;

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

        // update RPCs
        for (let i = 0; i < SUPPORTED_CHAINS.length; i++) {
            const
                chain = SUPPORTED_CHAINS[i],
                rpcNew = data[`${chain}_RPC`];
            if (rpcNew && chainsData[chain]?.rpcUrls)
                chainsData[chain].rpcUrls[0] = rpcNew;
        };
    };

export {
    getChainsData,
    getConfig,
    config,
};