import { ChainIds, EVMAddress, ErrorResponse, Product, ProductChain, ProductData, ProductDataAll, ProductParams, ProductRaw, ProductUpdateResponse, TransactionResponse } from "../types";
import { getChainsData } from "./config";
import { ZERO_ADDRESS, errorResponse } from "./contract";
import { getMerchantId } from "./merchant";
import { fromWei, getContract, toWei } from "./methods";
import { paginationData, processNumbers } from "./showcase";
import { getTokenUSDValue, getTokenData } from "./token";

const
    /** Product Fee */
    productFee = async (
        chain: ChainIds
    ): Promise<string | ErrorResponse | undefined> => {
        try {
            const contract = await getContract(chain);
            return (await contract.ProductFee())?.toString();
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Product Fee Text */
    productFeeText = async (
        chain: ChainIds,
    ): Promise<string | ErrorResponse | undefined> => {
        try {
            const value = await productFee(chain);
            if (typeof value != `string`) return value;
            const
                symbol = getChainsData()[chain]?.nativeCurrency?.symbol,
                weiAmount = value?.toString(),
                amount = fromWei(weiAmount || `0`, 18),
                usdValue = await getTokenUSDValue({
                    chain,
                    tokenAddress: ZERO_ADDRESS,
                    weiAmount,
                }) || 0;
            return `${symbol} ${processNumbers(amount)} ~ $${processNumbers(usdValue)}`;
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Add Product */
    addProduct = async ({
        chain,
        productPrice,
        tokenAddress,
        quantity,
        commissionAddress,
        commissionPercentage,
    }: ProductParams): Promise<
        ProductUpdateResponse
        | ErrorResponse
        | undefined
    > => await updateProduct({
        chain,
        productPrice,
        tokenAddress,
        quantity,
        commissionAddress,
        commissionPercentage,
    }),
    /** Update Product */
    updateProduct = async ({
        chain,
        productId,
        productPrice,
        tokenAddress,
        quantity,
        commissionAddress,
        commissionPercentage,
    }: ProductParams): Promise<
        ProductUpdateResponse
        | ErrorResponse
        | undefined
    > => {

        if (!productPrice) return

        try {
            const
                contract = await getContract(chain, true),
                value = await productFee(chain);
            if (typeof value != `string`) return value;

            tokenAddress = tokenAddress?.startsWith(`0x`) ? tokenAddress : ZERO_ADDRESS;

            const
                token = await getTokenData(chain, tokenAddress, true),
                price = toWei(productPrice, token?.decimals || 18),
                commAdd = (commissionAddress?.startsWith(`0x`) ? commissionAddress : ZERO_ADDRESS) as EVMAddress,
                commPer = commissionPercentage || `0`,
                qty = quantity || `0`,
                tx: TransactionResponse | undefined = productId ? await contract.updateProduct(
                    tokenAddress,
                    price,
                    commAdd,
                    commPer,
                    qty,
                    productId,
                ) : await contract.addProduct(
                    tokenAddress,
                    price,
                    commAdd,
                    commPer,
                    qty,
                    { value }
                ),
                hash = (await tx?.wait())?.hash,
                isNew = !+(productId || `0`);
            if (isNew) {
                const merchantId = await getMerchantId(chain);
                if (typeof merchantId != `string`) return merchantId;
                const
                    products = (await getProducts(chain, `0`, `1`, merchantId))?.products,
                    productIdNew = products?.[0]?.id;
                productId = productIdNew;
            };

            if (hash && productId)
                return { hash, productId, isNew }

        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Delete Product */
    deleteProduct = async (
        chain: ChainIds,
        productId: string
    ): Promise<string | ErrorResponse | undefined> => {
        try {
            const
                contract = await getContract(chain, true),
                tx: TransactionResponse =
                    await contract.deleteProduct(productId),
                hash = (await tx?.wait())?.hash;
            return hash
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Product Data Convert */
    productRawConvert = (productRaw: ProductRaw): Product => {
        return {
            id: productRaw[0]?.toString(),
            amount: productRaw[1]?.toString(),
            qty: productRaw[2]?.toString(),
            qtyCap: productRaw[3],
            token: productRaw[4]?.[0],
        }
    },
    /** Products List */
    getProducts = async (
        chain: ChainIds,
        pageNo: string,
        pageSize: string,
        merchantId: string = `0`
    ): Promise<
        { products: Product[], total: number }
        | undefined
    > => {
        try {
            const
                products: Product[] = [],
                contract = await getContract(chain),
                raw = await contract.getProducts(
                    pageNo,
                    pageSize,
                    merchantId
                ),
                data = raw[0],
                total = +raw[1]?.toString();
            for (let i = 0; i < data.length; i++)
                products.push(productRawConvert(data[i]));
            return { products, total }
        } catch (error: any) {
            return
        };
    },
    /** Product Details */
    getProductDetails = async (
        chain: ChainIds,
        productId: string
    ): Promise<
        Product
        | ErrorResponse
        | undefined
    > => {
        try {
            const contract = await getContract(chain);
            return productRawConvert(
                await contract.productDetails(productId)
            );
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Products List Processed */
    loadProducts = async ({
        chain,
        pageNo,
        pageSize,
        isMerchantOnly,
    }: {
        chain: ChainIds,
        pageNo: string,
        pageSize: string,
        isMerchantOnly?: boolean,
    }): Promise<ProductDataAll> => {

        const
            chainsData = getChainsData(),
            /** Product Data */
            productData = async ({
                index,
                products,
            }: {
                index: number,
                products: ProductChain[],
            }): Promise<ProductData> => {
                const
                    product = products[index],
                    productId = product?.id,
                    chain = product.chain,
                    token = await getTokenData(chain, product.token);
                return {
                    index,
                    product,
                    isRemoved: !+productId,
                    chainLogoImg: chainsData[chain].logo,
                    chainLogoAlt: `${chainsData[chain].chainName} chain logo`,
                    tokenLogoImg: token?.logo,
                    tokenLogoAlt: `${token?.name} token logo`,
                    productIdText: `#${productId}`,
                    productPrice: `${token?.symbol} ${processNumbers(fromWei(product.amount, token?.decimals || 18))}`,
                    productQuantity: product.qtyCap ? processNumbers(+product.qty) : `UNLIMITED`,
                }
            },
            merchantId = isMerchantOnly ? await getMerchantId(chain) : `0`,
            allData = typeof merchantId != `string` ? undefined
                : await getProducts(chain, pageNo, pageSize, merchantId),
            list = allData?.products || [],
            products: ProductChain[] = [],
            promises = [];

        for (let i = 0; i < list.length; i++)
            products.push({
                ...list[i],
                chain,
            });

        if (products?.length)
            for (let index = 0; index < products.length; index++)
                promises.push(productData({ index, products }));

        return {
            productsData: await Promise.all(promises),
            ...paginationData({
                pageSize,
                pageNo,
                totalNumber: (allData?.total || 0)?.toFixed(0),
            })
        };
    };

export {
    productFee,
    productFeeText,
    addProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductDetails,
    loadProducts,
};