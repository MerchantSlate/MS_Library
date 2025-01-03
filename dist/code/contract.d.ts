import { EVMAddress, ErrorResponse, StringObj } from "../types";
declare const 
/** Zero Address */
ZERO_ADDRESS: EVMAddress, 
/** Contract Messages */
contractErrors: StringObj, 
/** Contract Error Response Processing */
errorResponse: (error: any) => ErrorResponse;
export { ZERO_ADDRESS, contractErrors, errorResponse, };
