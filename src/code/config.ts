import chainsDataJSON from "../data/chains_data.json";
import { merchantSlateContract } from "../data/contract_address.json";
import { MerchantConfigBasics, MerchantConfigParams, SUPPORTED_CHAINS, SupportedChainsData } from "../types";
import { errorResponse } from "./contract";
import { configLargeSuffix } from "./showcase";

const
    /** Public RPCs obtained from https://chainlist.org/ and should only be used for testing */
    chainsData = chainsDataJSON as SupportedChainsData,
    /** Get updated chains data */
    getChainsData = () => chainsData,
    /** Merchant Slate configuration */
    configuration: MerchantConfigBasics = {
        merchantSlateContract,
        consoleLogEnabled: true,
        validRPCTime: 6e4,
    },
    /** Get updated configuration */
    getConfig = () => configuration,
    config = (data: MerchantConfigParams = {}) => {
        try {
            const {
                browserWallet,
                walletPrivateKey,
                walletSeedPhrase,
                billionSuffix,
                millionSuffix,
                merchantSlateContract,
                consoleLogEnabled,
                validRPCTime,
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

            // update RPC validation time
            if (validRPCTime != undefined)
                configuration.validRPCTime = validRPCTime;

            // update RPCs
            for (let i = 0; i < SUPPORTED_CHAINS.length; i++) {
                const
                    chain = SUPPORTED_CHAINS[i],
                    rpcNew = data[`${chain}_RPC`];
                if (rpcNew && chainsData[chain]?.rpcUrls) {
                    if (typeof rpcNew == `string`)
                        chainsData[chain].rpcUrls[0] = rpcNew;
                    else chainsData[chain].rpcUrls = rpcNew;
                };
            };
        } catch (error) {
            errorResponse({ origin: `config`, error });
        };
    };

export {
    getChainsData,
    getConfig,
    config,
};