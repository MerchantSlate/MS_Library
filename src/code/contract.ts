import { ZeroAddress } from "ethers";
import {
    ChainIds,
    EVMAddress,
    ErrorCodeString,
    ErrorResponse,
    ResultPromise,
    StringObj,
    TransactionResponse
} from "../types";
import { getConfig } from "./config";
import { readCache, saveCache } from "./cache";

const selectedChainKey = `selectedChain`;

/** Selected Chain */
let selectedChain: ChainIds = readCache(selectedChainKey);

const
    setSelectedChain = (
        chain: ChainIds,
    ) => {
        selectedChain = chain;
        saveCache(selectedChainKey, chain)
    },
    /** Zero Address */
    ZERO_ADDRESS = ZeroAddress as EVMAddress,
    /** Contract Messages */
    contractErrors: StringObj = {
        ERROR_INVALID_TOKEN: `Token used is invalid. Please provide another token.`,
        ERROR_TASK_IN_PROGRESS: `A task is already in progress. Please try again later.`,
        ERROR_NOT_AUTHORISED: `You do not have the required permissions to perform this action.`,
        ERROR_INVALID_INPUTS: `The inputs provided are invalid. Please review and correct them.`,
        ERROR_LOW_FUNDS: `Insufficient funds. Please top up your balance and try again.`,
        ERROR_OUT_OF_STOCK: `The requested item is out of stock. Please select a different quantity or product.`,
        ERROR_APPROVE_MISSING: `Approval is required before proceeding with this operation.`,
        UNKNOWN_ERROR: `Unknown error occurred. Please try again later.`,
    },
    rpcErrors: StringObj = {
        INSUFFICIENT_FUNDS: contractErrors[`ERROR_LOW_FUNDS`],
    },
    /** Process Transaction Hash */
    processTxHash = async (tx: TransactionResponse): ResultPromise<string> => {
        try {
            const data = (await tx?.wait())?.hash;
            if (typeof data != `string`) throw data
            return { success: true, data }
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Contract Error Response Processing */
    errorResponse = (error: any): ErrorResponse => {
        if (getConfig()?.consoleLogEnabled) console.log(`Contract error`, error);
        const
            defaultError = `UNKNOWN_ERROR`,
            errorCode: ErrorCodeString = error?.reason
                || error?.code
                || defaultError,
            errorNote: string = contractErrors[error?.reason]
                || rpcErrors[error?.code]
                || (
                    errorCode?.toLowerCase()?.includes(`exceeds balance`) ?
                        rpcErrors.INSUFFICIENT_FUNDS
                        : contractErrors[defaultError]
                );
        return {
            success: false,
            errorCode,
            errorNote,
        }
    };

export {
    selectedChain,
    setSelectedChain,
    ZERO_ADDRESS,
    contractErrors,
    processTxHash,
    errorResponse,
};