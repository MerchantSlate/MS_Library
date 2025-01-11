import { config, getChainsData, getConfig } from "./code/config";
import { ZERO_ADDRESS, contractErrors } from "./code/contract";
import { merchantFee, merchantSignup, getMerchantId, merchantFeeValueText } from "./code/merchant";
import { fromWei, getBrowserWallet, getContract, getProvider, getWalletAddress, toWei } from "./code/methods";
import { getPayments, loadPayments, payProduct, payValueText } from "./code/payments";
import { addProduct, deleteProduct, getProductDetails, getProducts, loadProducts, productFee, productFeeText, updateProduct } from "./code/products";
import { processNumbers, timeAMPM, fullDateText, truncateText } from "./code/showcase";
import { totalStakes, stakesCount, transferStake, offerStake, stakesOffered, takeStake, removeStakeOffer } from "./code/stakes";
import { getTokenUSDValue, getTokenData, getTokenRate, tokenOnchainData } from "./code/token";
import { BlockchainNetwork, ChainIds, EVMAddress, ErrorResponse, PaymentChain, PaymentData, PaymentDataAll, ProductChain, ProductData, ProductDataAll } from "./types";

export {
    // config
    getChainsData,
    getConfig,
    config,
    BlockchainNetwork,
    ChainIds,
    
    // contract address
    ZERO_ADDRESS,
    contractErrors,
    ErrorResponse,
    EVMAddress,
    truncateText,
    
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
    getTokenRate,
    getTokenUSDValue,

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
    ProductChain,
    ProductDataAll,

    // payments
    payValueText,
    payProduct,
    getPayments,
    loadPayments,
    PaymentData,
    PaymentChain,
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