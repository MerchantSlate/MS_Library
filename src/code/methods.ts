import {
    toBigInt,
    BrowserProvider,
    JsonRpcProvider,
    Wallet,
    InterfaceAbi,
    Contract,
} from "ethers";
import contractABI from "../data/contract_abi.json";
import approveABI from "../data/approve_abi.json";
import { config, getChainsData, getConfig } from "./config";
import {
    ChainIds,
    ContractFunctions,
    EVMAddress,
    ResultPromise
} from "../types";
import { errorResponse, processTxHash } from "./contract";

const
    /** Get BigNumbers */
    decimalFactor = (decimals: number | string | bigint) =>
        10n ** toBigInt(decimals),
    /** Multiply Numbers */
    multiplyNumbers = (
        a: number | string | bigint,
        b: number | string | bigint,
    ): number => {
        try {
            const value = +a?.toString() * +b?.toString();
            return value;
        } catch {
            return 0
        };
    },
    /** Divide Numbers */
    divideNumbers = (
        a: number | string | bigint,
        b: number | string | bigint,
    ): number => {
        try {
            const value = +a?.toString() / +b?.toString();
            return value;
        } catch {
            return 0
        };
    },
    /** Integer Number string */
    integerString = (
        value: number,
    ) => {
        try {
            return BigInt(value)?.toString()
        } catch (e) {
            return value?.toString()
        };
    },
    /** Convert to Wei Values */
    toWei = (
        value: string,
        decimals: number = 18,
    ): string => integerString(
        +(
            +value *
            +decimalFactor(decimals)?.toString()
        )?.toFixed(0)
    ),
    /** Convert from Wei Values */
    fromWei = (
        value: string,
        decimals: number = 18,
    ): number =>
        +value /
        +decimalFactor(decimals)?.toString(),
    /** Get browser wallet */
    getBrowserWallet = () => {
        try { // @ts-ignore
            const browserWallet: any = window?.ethereum;
            return browserWallet
        } catch (e) {
            return
        };
    },
    /** Switch browser wallet chain */
    switchChain = async (chain: ChainIds) => {
        const browserWallet = getBrowserWallet();
        if (!browserWallet) return
        const
            chainData = getChainsData()[chain],
            provider = new BrowserProvider(browserWallet);
        try {
            await provider.send(`wallet_switchEthereumChain`, [{ chainId: chainData.chainId }]);
        } catch (error: any) {
            if (error?.code != 4902)
                console.error(`Failed to switch network`, error);
            try {
                await provider.send(`wallet_addEthereumChain`, [chainData]);
            } catch (addError) {
                console.error(`Failed to add the network:`, addError);
            };
        }
    },
    /** Connect browser wallet */
    connectWallet = async (chain: ChainIds) => {
        if (getBrowserWallet()) {
            const chainsData = getChainsData();
            let provider = new BrowserProvider(getBrowserWallet());
            if (await provider.send(`eth_chainId`, []) != chainsData[chain].chainId) {
                await switchChain(chain);
                provider = new BrowserProvider(getBrowserWallet());
            };
            if (!getConfig().browserWallet) {
                const
                    addresses = await provider.send(`eth_accounts`, []),
                    address = addresses?.[0];
                if (address) config({
                    browserWallet: address
                });
            };
            return provider
        };
    },
    /** wallet provider */
    getProvider = async (
        chain: ChainIds,
        wallet: boolean = false
    ) => {
        const
            {
                walletPrivateKey,
                walletSeedPhrase,
            } = getConfig(),
            chainsData = getChainsData(),
            providerBrowser = wallet
                && !walletPrivateKey
                && !walletSeedPhrase
                ? await connectWallet(chain)
                : undefined,
            provider = providerBrowser
                || new JsonRpcProvider(chainsData[chain].rpcUrls[0]);
        return provider
    },
    /** wallet signer */
    getSigner = async (
        chain: ChainIds,
        wallet: boolean = false
    ) => {
        const
            {
                walletPrivateKey,
                walletSeedPhrase,
            } = getConfig(),
            provider = await getProvider(chain, wallet);
        if (!provider || !(await provider.getNetwork())) {
            console.log(`Provider not online`);
            return
        };

        const
            signer = wallet ?
                walletPrivateKey ? new Wallet(walletPrivateKey).connect(provider)
                    : walletSeedPhrase ? Wallet.fromPhrase(walletSeedPhrase).connect(provider)
                        : await provider?.getSigner()
                : Wallet.createRandom().connect(provider);
        return signer
    },
    /** wallet contract */
    getContract = async (
        chain: ChainIds,
        wallet: boolean = false,
        address?: string,
        abi: InterfaceAbi = contractABI,
    ) => {
        const chainsData = getChainsData();
        if (!wallet && !chainsData[chain]?.rpcUrls?.[0]) return {} as any as ContractFunctions;
        const
            signer = await getSigner(chain, wallet),
            contract = new Contract(
                address || getConfig().merchantSlateContract,
                abi,
                signer
            ) as any as ContractFunctions;
        return contract
    },
    /** Approve Token Transfers */
    approve = async ({
        chain,
        address,
        value,
    }: {
        chain: ChainIds,
        address: EVMAddress,
        value: string,
    }): ResultPromise<string> => {
        try {
            const
                { merchantSlateContract } = getConfig(),
                tokenContract = await getContract(
                    chain,
                    true,
                    address,
                    approveABI
                ),
                walletAddress = await getWalletAddress(chain),

                // allowance check
                allowance = (await tokenContract // @ts-ignore
                    ?.allowance(
                        walletAddress,
                        merchantSlateContract,
                    )
                )?.toString();
            if (+allowance >= +value)
                return { success: true, data: `` }

            // approve amount
            const tx = await tokenContract // @ts-ignore
                ?.approve(
                    merchantSlateContract,
                    value
                );
            return processTxHash(tx);
        } catch (error) {
            return errorResponse(error);
        };
    },
    /** Get wallet address */
    getWalletAddress = async (
        chain: ChainIds
    ): Promise<EVMAddress | undefined> => {
        const signer = await getSigner(chain, true);
        return signer?.address as EVMAddress
    };

export {
    decimalFactor,
    multiplyNumbers,
    divideNumbers,
    integerString,
    toWei,
    fromWei,
    getBrowserWallet,
    getProvider,
    getContract,
    approve,
    getWalletAddress,
};