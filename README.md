# MerchantSlate SDK - onchain crypto payment database

[Change Log](changes.md)

## Contract Deployed
Contract is currently deployed to 7 EVM chains
[More Info](https://github.com/MerchantSlate/Contract)

## Example Implementation
This package is implemented at merchantslate.com
[Example Website Repo](https://github.com/MerchantSlate/MS_Website)

## Setup
Install using `yarn add merchantslate` or `npm install merchantslate` 

OR use in browsers through CDN

`<script src="https://cdn.jsdelivr.net/npm/merchantslate@0.6.6/dist/browser/merchant.min.js"></script>`

Note `merchant` is the browser global object for this library functions

Note: Public RPCs obtained from https://chainlist.org/ are used as default for development only and should be updated using `config`

```typescript
// if using CDN use "merchant.config"
config({
    /** wallet private key (optional) used if no wallet can be connected in the setup environment */
    walletPrivateKey:``,
    /**
    * wallet seed phrase (optional) used if no wallet can be connected in the setup environment
    * cannot be used if private key is defined
    */
    walletSeedPhrase:``,

    /** ARBITRUM RPC URL */
    ARBITRUM_RPC:``,
    /** AVALANCHE RPC URL */
    AVALANCHE_RPC:``,
    /** APT RPC URL */
    APT_RPC:``,
    /** BSC RPC URL */
    BSC_RPC:``,
    /** CELO RPC URL */
    CELO_RPC:``,
    /** ETH RPC URL */
    ETH_RPC:``,
    /** FANTOM RPC URL */
    FANTOM_RPC:``,
    /** OPTIMISM RPC URL */
    OPTIMISM_RPC:``,
    /** POLYGON RPC URL */
    POLYGON_RPC:``,

    /** billion number suffix */
    billionSuffix: ``,
    /** million number suffix */
    millionSuffix: ``,

    /** MerchantSlate Contract Address (does not require change) */
    merchantSlateContract:``,
})
```

## Merchant Setup

### Merchant Fee
Text string showing value of merchant setup fee for a specific chain
```typescript
const feeValueText: string = await merchantFeeValueText(
    chain: ChainIds,
);
```

### Merchant Signup
Initiate merchant signup transaction
```typescript
const data: {
    hash?: string,
    merchantId?: string
} = await merchantSignup(
    chain: ChainIds,
);
```

### Merchant Id
Get merchant Id of connected wallet
```typescript
const merchantId: string = await getMerchantId(
    chain: ChainIds,
);
```

## Products Management

### Load Products
List all products limited by pagination parameters
Use `isMerchantOnly` to limit products loaded to ones of merchant wallet connected
```typescript
const data: {
    productsData: ProductData
} = await loadProducts({
    chain: ChainIds,
    pageNo: string,
    pageSize: string,
    isMerchantOnly?: boolean,
});
```

### Product Fee
Product fee value text, for fee required by contract to add products
```typescript
const feeText: string = await productFeeText(
    chain: ChainIds,
);
```

### Update Product
Product update using product id and new details to replace old ones, do not define quantity for unlimited quantity
```typescript
const data: {
    hash: string,
    productId: string,
    isNew: boolean
} = await updateProduct({
    productId?: string,
    chain: ChainIds,
    productPrice: string,
    tokenAddress?: EVMAddress,
    quantity?: string,
    commissionAddress?: string,
    commissionPercentage?: string,
});
```

### Delete Product
Product delete transaction
```typescript
const txHash: string = await deleteProduct(
    chain: ChainIds,
    productId: string,
);
```

## Payments Management

### Load Payments
List all payments limited by pagination parameters
Use `isMerchantOnly` to limit products loaded to ones of merchant wallet connected
Use `buyerWallet` to limit products loaded to ones made from a specific wallet
```typescript
const data: {
    currentPage: string;
    previousPage?: string;
    nextPage?: string;
    totalPages: string;
    paymentsData: PaymentData[];
} = await loadPayments({
    chain,
    pageNo,
    pageSize,
    isMerchantOnly: isMerchantPayments,
    buyerWallet: onlyMyPayments ? await getWalletAddress(chain) : undefined,
});
```

### Payment Details
Payment details as text including payment value
```typescript
const valueText = await payValueText(
    chain: ChainIds,
    product: ProductChain,
    quantity ?: string = `1`,
);
```

### Payment Transaction
Initiate payment transaction using connected wallet
```typescript
const data: {
    hash?: string,
    paymentId?: string,
} = await payProduct(
    chain: ChainIds,
    product: ProductChain,
    quantity ?: string = `1`,
);
```

## Stakes Management

### Offer Stake
Owners of the contract stake can offer stakes for public purchase on-chain
```typescript
const txHash: string = await offerStake(
    chain: ChainIds,
    stakeUnits: string,
    totalValueWei: string,
);
```

### Transfer Stake
Owners of the contract stake can transfer stakes
```typescript
const txHash: string = await transferStake(
    chain: ChainIds,
    stakeUnits: string,
    recipientAddress: EVMAddress,
);
```

### Take Stake
Any wallet can take an offered stake using the offer id. This initiates a transaction to take the stake.
```typescript
const txHash: string = await takeStake(
    chain: ChainIds,
    offerId: string,
);
```

## Remove Stake
Owners can remove their stake previously offered
```typescript
const txHash: string = await removeStakeOffer(
    chain: ChainIds,
    offerId: string,
);
```

## Total Stakes
Get Total number of contract stakes
```typescript
const stakesTotal: number = await totalStakes(
    chain: ChainIds,
);
```

## Stakes Count
Get Total number of stakes held by connected wallet and their status
```typescript
const data: {
    holdings: number,
    offered: number,
} = await stakesCount(
    chain: ChainIds,
);
```

## Stakes Offered
Get list offered on a specific chain
Use `wallet` boolean to show only stakes related to connected wallet
```typescript
const data: {
    listedStakes: StakeOffers,
    holderOffersCount: number,
} = await stakesOffered(
    chain: ChainIds,
    wallet?: boolean,
);
```