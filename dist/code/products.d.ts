import { ChainIds, Product, ProductDataAll, ProductExtended, ProductParams, ProductUpdateResponse, ResultPromise } from "../types";
declare const 
/** Product Fee */
productFee: (chain: ChainIds) => ResultPromise<string>, 
/** Product Fee Text */
productFeeText: (chain: ChainIds) => ResultPromise<string>, 
/** Add Product */
addProduct: ({ chain, productPrice, tokenAddress, quantity, commissionAddress, commissionPercentage, }: ProductParams) => ResultPromise<ProductUpdateResponse>, 
/** Update Product */
updateProduct: ({ chain, productId, productPrice, tokenAddress, quantity, commissionAddress, commissionPercentage, }: ProductParams) => ResultPromise<ProductUpdateResponse>, 
/** Delete Product */
deleteProduct: (chain: ChainIds, productId: string) => ResultPromise<string>, 
/** Products List */
getProducts: (chain: ChainIds, pageNo: string, pageSize: string, merchantId?: string) => Promise<{
    products?: Product[];
    total?: number;
}>, 
/** Product Details */
getProductDetails: (chain: ChainIds, productId: string) => ResultPromise<ProductExtended>, 
/** Products List Processed */
loadProducts: ({ chain, pageNo, pageSize, isMerchantOnly, }: {
    chain: ChainIds;
    pageNo: string;
    pageSize: string;
    isMerchantOnly?: boolean;
}) => Promise<ProductDataAll>;
export { productFee, productFeeText, addProduct, updateProduct, deleteProduct, getProducts, getProductDetails, loadProducts, };
