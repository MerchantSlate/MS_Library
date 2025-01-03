import { ZeroAddress } from "ethers";
import { EVMAddress, ErrorCodeString, ErrorResponse, StringObj } from "../types";

const
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
        ERROR_APPROVE_MISSING: `Approval is required before proceeding with this operation.`
    },
    rpcErrors: StringObj = {
        INSUFFICIENT_FUNDS: contractErrors[`ERROR_LOW_FUNDS`],
    },
    /** Contract Error Response Processing */
    errorResponse = (error: any): ErrorResponse => {
        const
            errorCode: ErrorCodeString | undefined = error?.reason || error?.code,
            errorNote: string | undefined = contractErrors[error?.reason] || rpcErrors[error?.code];
        return {
            errorCode,
            errorNote,
        }
    };

export {
    ZERO_ADDRESS,
    contractErrors,
    errorResponse,
};