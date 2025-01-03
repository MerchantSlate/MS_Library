import { ChainIds, ErrorResponse, Product, ProductDataAll, ProductParams, ProductUpdateResponse } from "../types";
declare const 
/** Product Fee */
productFee: (chain: ChainIds) => Promise<string | ErrorResponse | undefined>, 
/** Product Fee Text */
productFeeText: (chain: ChainIds) => Promise<string | ErrorResponse | undefined>, 
/** Add Product */
addProduct: ({ chain, productPrice, tokenAddress, quantity, commissionAddress, commissionPercentage, }: ProductParams) => Promise<ProductUpdateResponse | ErrorResponse | undefined>, 
/** Update Product */
updateProduct: ({ chain, productId, productPrice, tokenAddress, quantity, commissionAddress, commissionPercentage, }: ProductParams) => Promise<ProductUpdateResponse | ErrorResponse | undefined>, 
/** Delete Product */
deleteProduct: (chain: ChainIds, productId: string) => Promise<string | ErrorResponse | undefined>, 
/** Products List */
getProducts: (chain: ChainIds, pageNo: string, pageSize: string, merchantId?: string) => Promise<{
    products: Product[];
    total: number;
} | undefined>, 
/** Product Details */
getProductDetails: (chain: ChainIds, productId: string) => Promise<Product | ErrorResponse | undefined>, 
/** Products List Processed */
loadProducts: ({ chain, pageNo, pageSize, isMerchantOnly, }: {
    chain: ChainIds;
    pageNo: string;
    pageSize: string;
    isMerchantOnly?: boolean;
}) => Promise<ProductDataAll>;
export { productFee, productFeeText, addProduct, updateProduct, deleteProduct, getProducts, getProductDetails, loadProducts, };
