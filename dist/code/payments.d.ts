import { ChainIds, EVMAddress, ErrorResponse, Payment, PaymentDataAll, ProductChain } from "../types";
declare const 
/** Payment Value Text */
payValueText: (chain: ChainIds, product: ProductChain, quantity?: string) => Promise<string | undefined>, 
/** Pay Product */
payProduct: (chain: ChainIds, product: ProductChain, quantity?: string) => Promise<{
    hash?: string;
    paymentId?: string;
} | ErrorResponse | undefined>, 
/** Payments List */
getPayments: (chain: ChainIds, pageNo: string, pageSize: string, merchantId?: string, connectedWallet?: EVMAddress) => Promise<{
    payments: Payment[];
    total: number;
} | undefined>, 
/** Payments List Processed */
loadPayments: ({ chain, pageNo, pageSize, isMerchantOnly, buyerWallet, }: {
    chain: ChainIds;
    pageNo: string;
    pageSize: string;
    isMerchantOnly?: boolean;
    buyerWallet?: EVMAddress;
}) => Promise<PaymentDataAll>;
export { payValueText, payProduct, getPayments, loadPayments, };
