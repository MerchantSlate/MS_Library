import { config, getChainsData, getConfig } from "./code/config";
import { ZERO_ADDRESS, contractErrors } from "./code/contract";
import { merchantFee, merchantSignup, getMerchantId, merchantFeeValueText } from "./code/merchant";
import { fromWei, getBrowserWallet, getContract, getProvider, getWalletAddress, toWei } from "./code/methods";
import { getPayments, loadPayments, payProduct, payValueText } from "./code/payments";
import { addProduct, deleteProduct, getProductDetails, getProducts, loadProducts, productFee, productFeeText, updateProduct } from "./code/products";
import { processNumbers, timeAMPM, fullDateText } from "./code/showcase";
import { totalStakes, stakesCount, transferStake, offerStake, stakesOffered, takeStake, removeStakeOffer } from "./code/stakes";
import { getTokenData, tokenOnchainData } from "./code/token";
import { ErrorResponse, PaymentData, PaymentDataAll, ProductData, ProductDataAll } from "./types";

export {
    // config
    getChainsData,
    getConfig,
    config,

    // contract address
    ZERO_ADDRESS,
    contractErrors,
    ErrorResponse,
    
    // methods
    toWei,
    fromWei,
    getBrowserWallet,
    getProvider,
    getContract,
    getWalletAddress,

    // token
    getTokenData,
    tokenOnchainData,

    // merchant
    merchantFeeValueText,
    merchantFee,
    merchantSignup,
    getMerchantId,

    // products
    productFee,
    productFeeText,
    addProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductDetails,
    loadProducts,
    ProductData,
    ProductDataAll,

    // payments
    payValueText,
    payProduct,
    getPayments,
    loadPayments,
    PaymentData,
    PaymentDataAll,

    // showcase
    processNumbers,
    timeAMPM,
    fullDateText,

    // stakes
    totalStakes,
    stakesCount,
    transferStake,
    offerStake,
    stakesOffered,
    takeStake,
    removeStakeOffer,
};