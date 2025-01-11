interface StringObj {
    [key: string]: string
};

type EVMAddress = `0x${string}`;

interface ContractFunctions {

    // Public Data
    FeeDenom: () => Promise<BigInt>;
    MerchantFee: () => Promise<BigInt>;
    ProductFee: () => Promise<BigInt>;
    TotalStakes: () => Promise<BigInt>;

    // Merchant
    merchantSignup: (
        payment: { value: string },
    ) => Promise<TransactionResponse>;
    getMerchantId: () => Promise<BigInt>;
    addProduct: (
        tokenAddress: EVMAddress,
        amount: string,
        commAdd: EVMAddress,
        commPer: string,
        qty: string,
        payment: { value: string },
    ) => Promise<TransactionResponse>;
    updateProduct: (
        token: EVMAddress,
        amount: string,
        commAdd: EVMAddress,
        commPer: string,
        qty: string,
        productId: string
    ) => Promise<TransactionResponse>;
    deleteProduct: (productId: string) => Promise<TransactionResponse>;

    // Products
    getProducts: (
        pageNo: string,
        pageSize: string,
        merchantId: string
    ) => Promise<[ProductRaw[], BigInt]>;
    productDetails: (productId: string) => Promise<ProductRaw>;

    // Payments
    payProduct: (
        productId: string,
        quantity: string,
        payment?: { value: string },
    ) => Promise<TransactionResponse>;
    getPayments: (
        pageNo: string,
        pageSize: string,
        merchantId: string,
        buyer: EVMAddress
    ) => Promise<[PaymentRaw[], BigInt]>;

    // Stakes
    totalFeesPaid: () => Promise<BigInt>;
    stakesCount: () => Promise<[BigInt, BigInt]>;
    transferStake: (
        stakeUnits: string,
        recipientAddress: EVMAddress
    ) => Promise<TransactionResponse>;
    offerStake: (
        stakeUnits: string,
        valuePerStake: string
    ) => Promise<TransactionResponse>;
    stakesOffered: () => Promise<[BigInt[], BigInt[], boolean[], BigInt]>;
    removeStakeOffer: (offerId: string) => Promise<TransactionResponse>;
    takeStake: (
        offerId: string,
        payment: { value: string }
    ) => Promise<TransactionResponse>;

    // token data
    getTokenData: (tokenAddress: EVMAddress) => Promise<TokenDataRaw>;
    tokenRate: (
        tokenAddress: EVMAddress,
        amount: string,
        referenceAddress: EVMAddress
    ) => Promise<BigInt>;
}

interface TokenDataRaw {
    /** address */
    0: EVMAddress,
    /** name */
    1: string, // "(PoS) Tether USD"
    /** symbol */
    2: string, // "USDT"
    /** decimals */
    3: bigint, // 6n
}

interface TokenData {
    address: EVMAddress;
    name: string;
    symbol: string;
    decimals: number;
};

interface TokenDataExtended extends TokenData {
    logo: string;
};

interface Payment {
    id: string;
    time: string;
    prod: string;
    buyer: EVMAddress;
    token: EVMAddress;
    amount: string;
    qty: string;
    paid: string;
    comm: string;
}

interface PaymentRaw {
    0: bigint,
    1: bigint,
    2: bigint,
    3: EVMAddress,
    4: TokenDataRaw,
    5: bigint,
    6: bigint,
    7: bigint,
    8: bigint,
}

interface PaymentChain extends Payment {
    chain: ChainIds;
};

interface PaymentData {
    index: number;
    payment: PaymentChain;
    tokenData?: TokenDataExtended;
    isRemoved: boolean;
    chainLogoImg: string;
    chainLogoAlt: string;
    tokenLogoImg?: string;
    tokenLogoAlt?: string;
    paymentIdText: string;
    paymentTime: string;
    paymentTimestamp: number;
    buyerAddress: string;
    buyerAddressTxt: string;
    paidPrice: string;
    paidTotal: string;
    paidQty: string;
    paidFee: string;
}

interface PaymentDataAll extends PaginationData {
    paymentsData: PaymentData[]
}

interface Product {
    id: string;
    token: EVMAddress;
    amount: string;
    qty: string;
    qtyCap: boolean;
}

interface ProductRaw {
    /** id */
    0: bigint,
    /** Amount */
    1: bigint,
    /** Qty */
    2: bigint,
    /** Qty Cap */
    3: boolean,
    /** Token Data */
    4: TokenDataRaw,
}

interface ProductChain extends Product {
    chain: ChainIds;
};

interface PaginationData {
    currentPage: string;
    totalPages: string;
    previousPage?: string;
    nextPage?: string;
}

interface ProductData {
    index: number;
    product: ProductChain;
    isRemoved: boolean;
    chainLogoImg: string;
    chainLogoAlt: string;
    tokenLogoImg?: string;
    tokenLogoAlt: string;
    productIdText: string;
    productPrice: string;
    productQuantity: string;
}

interface ProductDataAll extends PaginationData {
    productsData: ProductData[]
}

export interface BlockchainNetwork {
    /** Deployment status */
    deployed: boolean;
    /** USDT address */
    USDT: EVMAddress;
    /** The chain ID in hexadecimal format (e.g., '0x1' for Ethereum Mainnet) */
    chainId: string;
    /** The name of the chain (e.g., 'Ethereum Mainnet') */
    chainName: string;
    /** The native currency details for the chain (name, symbol, decimals) */
    nativeCurrency: NativeCoin;
    /** The RPC URL(s) for the chain (MetaMask typically uses the first one) */
    rpcUrls: string[];
    /** The block explorer URL(s) for the chain (MetaMask typically uses the first one) */
    blockExplorerUrls: string[];
    /** Optional logo URL for the chain */
    logo: string;
    /** The CoinGecko ID for the chain (used for fetching price data) */
    coingeckoId: string;
    /** The explorer URL to view transactions on the blockchain */
    explorer: string;
}

interface NativeCoin {
    name: string;
    symbol: string;
    decimals: number;
}

interface SupportedChainsData {
    ETH: BlockchainNetwork,
    BSC: BlockchainNetwork,
    POLYGON: BlockchainNetwork,
    AVALANCHE: BlockchainNetwork,
    FANTOM: BlockchainNetwork,
    ARBITRUM: BlockchainNetwork,
    OPTIMISM: BlockchainNetwork,
    CELO: BlockchainNetwork,
}

type ChainIds = keyof SupportedChainsData;

interface Signature {
    _type: string;
    networkV: number | null;
    r: string;
    s: string;
    v: number;
}

interface TransactionResponse {
    _type: string;
    accessList: any[]; // or more specific type if known
    blockNumber: number | null;
    blockHash: string | null;
    blobVersionedHashes: string | null;
    chainId: string;
    data: string;
    from: string;
    gasLimit: string;
    gasPrice: string;
    hash: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    maxFeePerBlobGas: string | null;
    nonce: number;
    signature: Signature;
    to: string;
    type: number;
    value: string;
    wait: () => Promise<TransactionReceipt | undefined>
}

interface TransactionReceipt {
    _type: "TransactionReceipt";
    blobGasPrice: string | null;
    blobGasUsed: string | null;
    blockHash: string;
    blockNumber: number;
    contractAddress: string | null;
    cumulativeGasUsed: string;
    from: string;
    gasPrice: string;
    gasUsed: string;
    hash: string;
    index: number;
    logs: Log[];
    logsBloom: string;
    root: string | null;
    status: number;
    to: string;
}

interface Log {
    _type: "log";
    address: string;
    blockHash: string;
    blockNumber: number;
    data: string;
    index: number;
    removed: boolean | null;
    topics: string[];
    transactionHash: string;
    transactionIndex: number;
}

interface ErrorCodes {
    ERROR_INVALID_TOKEN: string;
    ERROR_TASK_IN_PROGRESS: string;
    ERROR_NOT_AUTHORISED: string;
    ERROR_INVALID_INPUTS: string;
    ERROR_LOW_FUNDS: string;
    ERROR_OUT_OF_STOCK: string;
    ERROR_APPROVE_MISSING: string;
    INSUFFICIENT_FUNDS?: string;
};

type ErrorCodeString = keyof ErrorCodes;

interface ErrorResponse {
    errorCode?: ErrorCodeString;
    errorNote?: string;
};

interface ProductParams {
    productId?: string,
    chain: ChainIds,
    productPrice: string,
    tokenAddress?: EVMAddress,
    quantity?: string,
    commissionAddress?: string,
    commissionPercentage?: string,
}

interface ProductUpdateResponse {
    hash: string,
    productId: string,
    isNew: boolean
}

interface StakeOffered {
    offerId: string,
    offerValue: string,
    isHolderOffer: boolean,
}

interface StakeOffers {
    [offerId: string]: StakeOffered
}

export {
    /** strings object */
    StringObj,
    /** EVM address string */
    EVMAddress,

    /** supported chains data object */
    SupportedChainsData,
    /** supported chains type */
    ChainIds,

    /** contract functions */
    ContractFunctions,

    /** token data (contract response) */
    TokenDataRaw,
    /** token data */
    TokenData,
    /** token data + logo string */
    TokenDataExtended,

    /** transaction function response */
    TransactionResponse,

    /** Pagination */
    PaginationData,

    /** payment data (contract response) */
    PaymentRaw,
    /** payment data */
    Payment,
    /** payment data + chain type */
    PaymentChain,
    /** payment data presentation */
    PaymentData,
    /** payment data with pagination */
    PaymentDataAll,

    /** update product data function parameters */
    ProductParams,
    /** update product response */
    ProductUpdateResponse,
    /** product data (contract response) */
    ProductRaw,
    /** product data */
    Product,
    /** product data + chain type */
    ProductChain,
    /** product data presentation */
    ProductData,
    /** products data with pagination */
    ProductDataAll,

    /** error response object */
    ErrorResponse,
    /** error response code strings */
    ErrorCodeString,

    /** stake offered */
    StakeOffered,
    /** stakes offered object */
    StakeOffers,
}