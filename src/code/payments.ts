import { toBigInt } from "ethers";
import {
    ChainIds,
    EVMAddress,
    ErrorResponse,
    Payment,
    PaymentChain,
    PaymentData,
    PaymentDataAll,
    PaymentRaw,
    ProductChain,
    TransactionResponse
} from "../types";
import { getChainsData } from "./config";
import { ZERO_ADDRESS, errorResponse } from "./contract";
import { getMerchantId } from "./merchant";
import { approve, fromWei, getContract, getWalletAddress } from "./methods";
import { fullDateText, paginationData, processNumbers, timeAMPM, truncateText } from "./showcase";
import { getTokenData } from "./token";

const
    /** Payment Value Text */
    payValueText = async (
        chain: ChainIds,
        product: ProductChain,
        quantity: string = `1`,
    ): Promise<string | undefined> => {
        const
            value = (+product.amount * +quantity)?.toString(),
            token = await getTokenData(chain, product?.token, true),
            symbol = token?.symbol == `NATIVE` ?
                getChainsData()[chain]?.nativeCurrency?.symbol
                : token?.symbol;
        return `${symbol} ${processNumbers(fromWei(value, token?.decimals || 18))}`;
    },
    lastPaymentId = async (chain: ChainIds): Promise<string | undefined> => {
        const
            walletAddress = await getWalletAddress(chain),
            data = await getPayments(chain, `0`, `1`, `0`, walletAddress),
            payment = data?.payments[0];
        return payment?.id
    },
    /** Pay Product */
    payProduct = async (
        chain: ChainIds,
        product: ProductChain,
        quantity: string = `1`,
    ): Promise<
        { hash?: string, paymentId?: string }
        | ErrorResponse
        | undefined
    > => {
        try {
            const
                productId = product.id,
                contract = await getContract(chain, true),
                value = (toBigInt(product.amount) * toBigInt(quantity))?.toString(),
                token = await getTokenData(chain, product?.token, true),
                tokenAddress = token?.address,
                isNative = tokenAddress == ZERO_ADDRESS,
                approveRequired = !isNative && tokenAddress,
                approveFirst = approveRequired ? await approve({
                    chain,
                    address: tokenAddress,
                    value
                }) : undefined,
                tx: TransactionResponse = approveRequired ?
                    await contract.payProduct(productId, quantity)
                    : await contract.payProduct(
                        productId,
                        quantity,
                        { value }
                    ),
                hash = (await tx?.wait())?.hash,
                paymentId = await lastPaymentId(chain);
            return { hash, paymentId }
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Payment Data Convert */
    paymentRawConvert = (paymentRaw: PaymentRaw): Payment => {
        return {
            id: paymentRaw[0]?.toString(),
            time: paymentRaw[1]?.toString(),
            prod: paymentRaw[2]?.toString(),
            buyer: paymentRaw[3] as EVMAddress,
            token: paymentRaw[4]?.[0] as EVMAddress,
            amount: paymentRaw[5]?.toString(),
            qty: paymentRaw[6]?.toString(),
            paid: paymentRaw[7]?.toString(),
            comm: paymentRaw[8]?.toString(),
        }
    },
    /** Payments List */
    getPayments = async (
        chain: ChainIds,
        pageNo: string,
        pageSize: string,
        merchantId: string = `0`,
        connectedWallet?: EVMAddress,
    ): Promise<{
        payments: Payment[],
        total: number,
    } | undefined> => {
        try {
            const
                contract = await getContract(chain),
                data = await contract.getPayments(
                    pageNo,
                    pageSize,
                    merchantId,
                    connectedWallet || ZERO_ADDRESS
                ),
                list = data[0],
                total = +data[1]?.toString(),
                payments: Payment[] = [];
            for (let i = 0; i < list.length; i++)
                payments.push(paymentRawConvert(list[i]));
            return { payments, total };
        } catch (error: any) {
            return
        };
    },
    /** Payments List Processed */
    loadPayments = async ({
        chain,
        pageNo,
        pageSize,
        isMerchantOnly,
        buyerWallet,
    }: {
        chain: ChainIds,
        pageNo: string,
        pageSize: string,
        isMerchantOnly?: boolean,
        buyerWallet?: EVMAddress
    }): Promise<PaymentDataAll> => {

        const
            chainsData = getChainsData(),
            /** Payment Unit */
            paymentData = async ({
                index,
                payments,
            }: {
                index: number,
                payments: PaymentChain[],
            }): Promise<PaymentData> => {
                const
                    payment = payments[index],
                    chain = payment.chain,
                    time = +`${payment.time}000`,
                    price = payment.amount,
                    quantity = payment.qty,
                    paymentAmount = +quantity * +price,
                    fees = paymentAmount - +payment.paid - +payment.comm,
                    tokenData = await getTokenData(chain, payment.token),
                    paymentId = payment?.id;
                return {
                    index,
                    payment,
                    tokenData,
                    isRemoved: !+paymentId,
                    chainLogoImg: chainsData[chain].logo,
                    chainLogoAlt: `${chainsData[chain].chainName} chain logo`,
                    tokenLogoImg: tokenData?.logo,
                    tokenLogoAlt: `${tokenData?.name} token logo`,
                    paymentIdText: `#${paymentId}`,
                    paymentTime: `${timeAMPM(time)} - ${fullDateText(time)}`,
                    paymentTimestamp: time,
                    buyerAddress: payment.buyer,
                    buyerAddressTxt: truncateText(payment.buyer),
                    paidPrice: `${tokenData?.symbol} ${processNumbers(fromWei(price, tokenData?.decimals || 18))}`,
                    paidTotal: `${tokenData?.symbol} ${processNumbers(fromWei(paymentAmount?.toString(), tokenData?.decimals || 18))}`,
                    paidQty: processNumbers(+quantity),
                    paidFee: `${tokenData?.symbol} ${processNumbers(fromWei(fees?.toFixed(0), tokenData?.decimals || 18))}`,
                }
            },
            merchantId = isMerchantOnly ? await getMerchantId(chain) : `0`,
            allData = typeof merchantId != `string` ? undefined
                : await getPayments(
                    chain,
                    pageNo,
                    pageSize,
                    merchantId,
                    buyerWallet
                ),
            list = allData?.payments || [],
            payments: PaymentChain[] = [],
            promises = [];

        for (let i = 0; i < list.length; i++)
            payments.push({
                ...list[i],
                chain,
            });

        if (payments?.length)
            for (let index = 0; index < payments.length; index++)
                promises.push(paymentData({ index, payments }));

        return {
            paymentsData: await Promise.all(promises),
            ...paginationData({
                pageSize,
                pageNo,
                totalNumber: (allData?.total || 0)?.toFixed(0),
            })
        };
    };

export {
    payValueText,
    payProduct,
    getPayments,
    loadPayments,
}