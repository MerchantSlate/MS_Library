import {
    ChainIds,
    EVMAddress,
    Product,
    ProductChain,
    ProductData,
    ProductDataAll,
    ProductExtended,
    ProductParams,
    ProductRaw,
    ProductUpdateResponse,
    ResultPromise,
    TokenData,
} from "../types";
import { getChainsData } from "./config";
import { ZERO_ADDRESS, errorResponse, processTxHash } from "./contract";
import { getMerchantId } from "./merchant";
import { fromWei, getContract, multiplyNumbers, toWei } from "./methods";
import { paginationData, processNumbers } from "./showcase";
import { getTokenData, getTokenRate, tokenOnchainData } from "./token";

const
    /** Product Fee */
    productFee = async (
        chain: ChainIds
    ): ResultPromise<string> => {
        try {
            const
                contract = await getContract(chain),
                data = (await contract.ProductFee())?.toString();
            if (typeof data != `string`) throw data;
            return { success: true, data }
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Product Fee Text */
    productFeeText = async (
        chain: ChainIds,
    ): ResultPromise<string> => {
        try {
            const productFeeRes = await productFee(chain);
            if (!productFeeRes?.success) return productFeeRes;

            const
                value = productFeeRes?.data,
                symbol = getChainsData()[chain]?.nativeCurrency?.symbol,
                weiAmount = value?.toString(),
                coinAmount = fromWei(weiAmount || `0`, 18),
                usdRate = await getTokenRate({
                    chain,
                    tokenAddress: ZERO_ADDRESS,
                }),
                usdValue = multiplyNumbers(usdRate, coinAmount),
                data = `${symbol} ${processNumbers(coinAmount)} ~ $${processNumbers(usdValue)}`;
            return { success: true, data };
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
    }: ProductParams): ResultPromise<ProductUpdateResponse> =>
        await updateProduct({
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
    }: ProductParams): ResultPromise<ProductUpdateResponse> => {
        try {
            if (!productPrice) throw undefined

            const
                contract = await getContract(chain, true),
                productFeeRes = await productFee(chain);
            if (!productFeeRes?.success) return productFeeRes;

            tokenAddress = tokenAddress?.startsWith(`0x`) ? tokenAddress : ZERO_ADDRESS;

            const
                value = productFeeRes?.data,
                token = await getTokenData(chain, tokenAddress, true),
                price = toWei(productPrice, token?.decimals || 18),
                commAdd = (commissionAddress?.startsWith(`0x`) ? commissionAddress : ZERO_ADDRESS) as EVMAddress,
                commPer = commissionPercentage || `0`,
                qty = quantity || `0`,
                tx = productId ? await contract.updateProduct(
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
                hashRes = await processTxHash(tx);
            if (!hashRes?.success) return hashRes;

            // product id check
            const isNew = !+(productId || `0`);
            if (isNew) {
                const merchantIdRes = await getMerchantId(chain);
                if (!merchantIdRes?.success) return merchantIdRes;

                const
                    merchantId = merchantIdRes?.data,
                    products = (await getProducts(chain, `0`, `1`, merchantId))?.products,
                    productIdNew = products?.[0]?.id;
                productId = productIdNew;
            };
            if (!productId) throw productId;

            // response
            const
                hash = hashRes?.data,
                data = { isNew, productId, hash };
            return { success: true, data }
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Delete Product */
    deleteProduct = async (
        chain: ChainIds,
        productId: string
    ): ResultPromise<string> => {
        try {
            const
                contract = await getContract(chain, true),
                tx = await contract.deleteProduct(productId);
            return processTxHash(tx);
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
    ): Promise<{ products?: Product[], total?: number }> => {
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
            return {}
        };
    },
    /** Product Details */
    getProductDetails = async (
        chain: ChainIds,
        productId: string
    ): ResultPromise<ProductExtended> => {
        try {
            const
                contract = await getContract(chain),
                productRaw = await contract.productDetails(productId);
            if (!productRaw?.[0]) throw productRaw
            const
                product = productRawConvert(productRaw),
                tokenAddress = product.token,
                weiAmount = product.amount,
                allData = await Promise.all([
                    getTokenData(chain, tokenAddress, true),
                    getTokenRate({ chain, tokenAddress })
                ]),
                token = allData[0] || {} as TokenData,
                coinAmount = fromWei(weiAmount, token.decimals),
                usdRate = allData[1],
                usdValue = multiplyNumbers(usdRate, coinAmount),
                data = {
                    product,
                    token,
                    usdValue,
                };
            return { success: true, data }
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
            merchantIdRes = isMerchantOnly ? await getMerchantId(chain) : undefined,
            merchantId = merchantIdRes?.success ? merchantIdRes?.data : `0`,
            allData = isMerchantOnly && (!merchantId || merchantId == `0`) ? undefined
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