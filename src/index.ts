import { config, getChainsData, getConfig } from "./code/config";
import { ZERO_ADDRESS, contractErrors, selectedChain, setSelectedChain } from "./code/contract";
import { merchantFee, merchantSignup, getMerchantId, merchantFeeValueText } from "./code/merchant";
import { fromWei, getBrowserWallet, getContract, getProvider, getWalletAddress, integerString, toWei } from "./code/methods";
import { getPayments, loadPayments, payProduct, payTxs, payValidation, payValueText } from "./code/payments";
import { addProduct, deleteProduct, getProductDetails, getProducts, loadProducts, productFee, productFeeText, updateProduct } from "./code/products";
import { processNumbers, timeAMPM, fullDateText, truncateText } from "./code/showcase";
import { totalStakes, stakesCount, transferStake, offerStake, stakesOffered, takeStake, removeStakeOffer } from "./code/stakes";
import { getTokenData, getTokenRate, tokenOnchainData } from "./code/token";
import { BlockchainNetwork, ChainIds, EVMAddress, ErrorResponse, MerchantConfigParams, PayTxsData, Payment, PaymentChain, PaymentData, PaymentDataAll, ProductChain, ProductData, ProductDataAll, TxObj } from "./types";

export {
    // config
    getChainsData,
    getConfig,
    config,
    BlockchainNetwork,
    ChainIds,
    MerchantConfigParams,

    // contract address
    selectedChain,
    setSelectedChain,
    ZERO_ADDRESS,
    contractErrors,
    ErrorResponse,
    EVMAddress,
    truncateText,

    // methods
    integerString,
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
    payTxs,
    payValidation,
    getPayments,
    loadPayments,
    Payment,
    PaymentData,
    PaymentChain,
    PaymentDataAll,
    PayTxsData,
    TxObj,

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