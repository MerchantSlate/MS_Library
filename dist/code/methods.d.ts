import { BrowserProvider, JsonRpcProvider, InterfaceAbi } from "ethers";
import { ChainIds, ContractFunctions, EVMAddress, ResultPromise } from "../types";
declare const 
/** Get BigNumbers */
decimalFactor: (decimals: number | string | bigint) => bigint, 
/** Multiply Numbers */
multiplyNumbers: (a: number | string | bigint, b: number | string | bigint) => number, 
/** Divide Numbers */
divideNumbers: (a: number | string | bigint, b: number | string | bigint) => number, 
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
/** Approve Token Transfers */
approve: ({ chain, address, value, }: {
    chain: ChainIds;
    address: EVMAddress;
    value: string;
}) => ResultPromise<string>, 
/** Get wallet address */
getWalletAddress: (chain: ChainIds) => Promise<EVMAddress | undefined>;
export { decimalFactor, multiplyNumbers, divideNumbers, integerString, toWei, fromWei, getBrowserWallet, getProvider, getContract, approve, getWalletAddress, };
