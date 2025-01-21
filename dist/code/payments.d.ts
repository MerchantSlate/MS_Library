import { ChainIds, EVMAddress, Payment, PaymentDataAll, ProductChain, ResultPromise, TokenData } from "../types";
declare const 
/** Payment Value Text */
payValueText: (chain: ChainIds, product: ProductChain, quantity?: string) => Promise<string | undefined>, 
/** Pay Product */
payProduct: (chain: ChainIds, product: ProductChain, quantity?: string) => ResultPromise<{
    hash?: string;
    paymentId?: string;
}>, 
/** Pay product transactions */
payTxs: (chain: ChainIds, productId: string, quantity?: string) => ResultPromise<{
    chainId: string;
    contract: string;
    token: TokenData;
    amount: string;
    approveTx: string;
    payTx: string;
}>, 
/** Payments List */
getPayments: (chain: ChainIds, pageNo: string, pageSize: string, merchantId?: string, connectedWallet?: EVMAddress) => Promise<{
    payments?: Payment[];
    total?: number;
}>, 
/** Payments List Processed */
loadPayments: ({ chain, pageNo, pageSize, isMerchantOnly, buyerWallet, }: {
    chain: ChainIds;
    pageNo: string;
    pageSize: string;
    isMerchantOnly?: boolean;
    buyerWallet?: EVMAddress;
}) => Promise<PaymentDataAll>;
export { payValueText, payProduct, payTxs, getPayments, loadPayments, };
