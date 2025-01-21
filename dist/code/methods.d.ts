import { BrowserProvider, JsonRpcProvider, InterfaceAbi, Contract } from "ethers";
import { ChainIds, ContractFunctions, EVMAddress, ResultPromise } from "../types";
declare const 
/** Integer Number string */
integerString: (value: number) => string, 
/** Convert to Wei Values */
toWei: (value: string, decimals?: number) => string, 
/** Convert from Wei Values */
fromWei: (value: string, decimals?: number) => number, 
/** Get browser wallet */
getBrowserWallet: () => any, 
/** wallet provider */
getProvider: (chain: ChainIds, wallet?: boolean) => Promise<BrowserProvider | JsonRpcProvider>, 
/** wallet contract */
getContract: (chain: ChainIds, wallet?: boolean, address?: string, abi?: InterfaceAbi) => Promise<ContractFunctions>, 
/** contract (unsigned) */
getContractUnsigned: (address?: string, abi?: InterfaceAbi) => Contract, 
/** Approve Token Transfers */
approve: ({ chain, address, value, }: {
    chain: ChainIds;
    address: EVMAddress;
    value: string;
}) => ResultPromise<string>, 
/** Get wallet address */
getWalletAddress: (chain: ChainIds) => Promise<EVMAddress | undefined>;
export { integerString, toWei, fromWei, getBrowserWallet, getProvider, getContract, getContractUnsigned, approve, getWalletAddress, };
