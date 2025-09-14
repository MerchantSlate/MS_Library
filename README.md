# MerchantSlate SDK - onchain crypto payment database
MerchantSlate SDK is a TypeScript library for on-chain crypto payment databases, supporting front-end and back-end solutions across popular EVM chains. It enables product management, payment processing, and utility functions like fetching live token rates and data (e.g., relative to USDT). Install via npm, yarn, or CDN, and customize with RPCs.


## Change Log
[Change Log](changes.md)


## Contract Deployed
Contract is currently deployed across popular EVM chains
[More Info](https://github.com/MerchantSlate/Contract)


## Example Implementation
This package is implemented at merchantslate.com
[Example Website Repo](https://github.com/MerchantSlate/MS_Website)


## Setup
Install using `yarn add merchantslate` or `npm install merchantslate` 

OR use in browsers through CDN

```html
<script 
  src="https://cdn.jsdelivr.net/npm/merchantslate@0.6.9/dist/browser/merchant.min.js"
></script>
```

Note `merchant` is the browser global object for this library functions.

### Config
Accepts a `MerchantConfigParams` object (RPC urls, private key/seed, suffixes, contract address)

Note: Public RPCs obtained from https://chainlist.org/ are used as default for development only and should be updated using `config`

```typescript
config({
  /** wallet private key (optional) 
   * used if no wallet can be connected in the setup environment 
   */
  walletPrivateKey?: string,
  /**
   * wallet seed phrase (optional) 
   * used if no wallet can be connected in the setup environment
   * cannot be used if private key is defined
   */
  walletSeedPhrase?: string,
  /** BSC RPC URL (same for any other chain)
   * all chains list available as SUPPORTED_CHAINS 
   */
  BSC_RPC: string,
  /** billion number suffix */
  billionSuffix?: string,
  /** million number suffix */
  millionSuffix?: string,
  /** MerchantSlate Contract Address (does not require change) */
  merchantSlateContract?: string,
})
```

### Get Chains Data
Returns data of supported chains (`BlockchainNetwork` type)
```typescript
getChainsData(): BlockchainNetwork[]
```

### Get Config
Returns the current configuration object
```typescript
getConfig(): MerchantConfigParams
```

### Selected Chain
The currently selected chain ID
```typescript
selectedChain: ChainIds
```

### Set Selected Chain
Sets the selected chain
```typescript
setSelectedChain(chain: ChainIds): void
```

### Zero Address
The zero address constant
```typescript
ZERO_ADDRESS: EVMAddress
```

### Contract Errors
Object of possible error codes / messages from smart contract
```typescript
contractErrors: Record<string, string>
```


## Token

### Get Token Data
Gets on-chain token metadata (symbol, name, decimals etc.)
```typescript
getTokenData(
  tokenAddress: EVMAddress,
  chain: ChainIds
): Promise<TokenData>
```

### Token Onchain Data
Maybe similar but includes additional data (e.g. balances?)
```typescript
tokenOnchainData(
  tokenAddress: EVMAddress,
  chain: ChainIds
): Promise<OnchainTokenData>
```

### Get Token Rate
Gets current rate / price of token in some unit or relative value
```typescript
getTokenRate(
  tokenAddress: EVMAddress,
  chain: ChainIds
): Promise<number>
```


## Merchant

### Merchant Fee
Fee required to register as merchant on given chain (in wei or string)
```typescript
merchantFee(chain: ChainIds): Promise<string>
```

### Merchant Fee Value Text
Same as merchantFee but formatted as human readable text
```typescript
merchantFeeValueText(chain: ChainIds): Promise<string>
```

### Merchant Signup
Initiate merchant signup transaction
```typescript
merchantSignup(
  chain: ChainIds
): Promise<{ hash?: string; merchantId?: string }>
```

### Get Merchant Id
Get merchant id of connected wallet
```typescript
getMerchantId(chain: ChainIds): Promise<string>
```


## Products

### Product Fee
Fee to add product on given chain
```typescript
productFee(chain: ChainIds): Promise<string>
```

### Product Fee Text
Product fee formatted as text

```typescript
productFeeText(chain: ChainIds): Promise<string>
```

### Add Product
Add or update product details
```typescript
addProduct(params: { 
  chain: ChainIds; 
  productPrice: string;
  tokenAddress?: EVMAddress;
  quantity?: string; 
  commissionAddress?: string; 
  commissionPercentage?: string; 
  productId?: string; 
}): Promise<{ 
  hash: string; 
  productId: string; 
  isNew: boolean 
}>
```

### Update Product
Update existing product
```typescript
updateProduct(params: { 
  chain: ChainIds; 
  productPrice: string;
  tokenAddress?: EVMAddress;
  quantity?: string; 
  commissionAddress?: string; 
  commissionPercentage?: string; 
  productId?: string; 
}): Promise<{ 
  hash: string; 
  productId: string; 
  isNew: boolean 
}>
```

### Delete Product
Delete a product; returns transaction hash
```typescript
deleteProduct(
  chain: ChainIds, 
  productId: string
): Promise<string>
```

### Get Products
Fetch products with optional pagination / filter
```typescript
getProducts(
  chain: ChainIds, 
  pageNo?: string, 
  pageSize?: string, 
  isMerchantOnly?: boolean
): Promise<ProductDataAll>
```

### Get Product Details
Get all data for a single product
```typescript
getProductDetails(
  chain: ChainIds, 
  productId: string
): Promise<ProductData>
```

### Load Products
Similar to getProducts but wrapped for UI loading etc.
```typescript
loadProducts(params: { 
  chain: ChainIds; 
  pageNo: string; 
  pageSize: string; 
  isMerchantOnly?: boolean 
}): Promise<{ productsData: ProductDataAll }>
```


## Payments

### Get Payments
Fetch payments with pagination and optional filters
```typescript
getPayments(
  chain: ChainIds, 
  pageNo?: string, 
  pageSize?: string, 
  isMerchantOnly?: boolean, 
  buyerWallet?: EVMAddress
): Promise<{ 
  currentPage: string; 
  previousPage?: string; 
  nextPage?: string; 
  totalPages: string; 
  paymentsData: PaymentDataAll 
}>
```

### Load Payments
Same as getPayments but wrapped for UI
```typescript
loadPayments(params: { 
  chain: ChainIds; 
  pageNo: string; 
  pageSize: string; 
  isMerchantOnly: boolean; 
  buyerWallet?: EVMAddress; 
}): Promise<{ 
  currentPage: string; 
  previousPage?: string; 
  nextPage?: string; 
  totalPages: string; 
  paymentsData: PaymentDataAll 
}>
```

### Pay Product
Initiate payment transaction
```typescript
payProduct(
  chain: ChainIds, 
  product: ProductChain, 
  quantity?: string
): Promise<{ 
  hash?: string; 
  paymentId?: string 
}>
```

### Pay Value Text
Payment value converted to human readable text
```typescript
payValueText(
  chain: ChainIds, 
  product: ProductChain, 
  quantity?: string
): Promise<string>
```

### Pay Txs
Fetch transaction details for a list of payment IDs
```typescript
payTxs(
  chain: ChainIds, 
  paymentIds: string[]
): Promise<{
  chainId: string,
  token: TokenData,
  amount: string,
  txs: TxObj[]
}>
```

### Pay Validation
Validate that payment inputs are acceptable etc.
```typescript
payValidation(
  chain: ChainIds, 
  product: ProductChain, 
  quantity?: string
): Promise<boolean>
```


## Stakes

### Total Stakes
Returns total stake units/stake count on the contract

```typescript
totalStakes(chain: ChainIds): Promise<number>
```

### Stakes Count
Returns count of stakes held by wallet + offered stakes
```typescript
stakesCount(
  chain: ChainIds
): Promise<{ 
  holdings: number; 
  offered: number 
}>
```

### Offer Stake
Owners offer stakes for public purchase
```typescript
offerStake(
  chain: ChainIds, 
  stakeUnits: string, 
  totalValueWei: string
): Promise<string>
```

### Stakes Offered
Get list of stake offers; optionally only for connected wallet
```typescript
stakesOffered(
  chain: ChainIds, 
  walletOnly?: boolean
): Promise<{ 
  listedStakes: StakeOffers; 
  holderOffersCount: number 
}>
```

### Transfer Stake
Transfer stakes to someone else
```typescript
transferStake(
  chain: ChainIds, 
  stakeUnits: string, 
  recipientAddress: EVMAddress
): Promise<string>
```

### Take Stake
Take an existing stake offer by id
```typescript
takeStake(chain: ChainIds, offerId: string): Promise<string>
```

### Remove Stake Offer
Remove a previously created stake offer
```typescript
removeStakeOffer(
  chain: ChainIds,
  offerId: string
): Promise<string>
```


## Wallet Methods

### Browser Wallet
Returns the connected browser wallet signer or undefined
```typescript
getBrowserWallet(): Promise<Signer | undefined>
```

### Setup Provider
Returns the ethers provider based on the configuration
```typescript
getProvider(): Provider
```

### Contract Object
Returns the contract instance connected to the current chain
```typescript
getContract(): Contract
```

### Wallet Address
Returns address of connected wallet (if any)
```typescript
getWalletAddress(): Promise<string | undefined>
```


## General Methods

### Integer String
Normalize number/string into integer string (no decimals)
```typescript
integerString(num: string | number): string
```

### To Wei
Convert from units to Wei (or smallest unit)
```typescript
toWei(amount: string, decimals?: number): string
```

### From Wei
Convert from Wei to human readable units
```typescript
fromWei(amount: string, decimals?: number): string
```

### Process Numbers
Format numbers suitably (commas etc.)
```typescript
processNumbers(input: number | string): string
```

### Time AMPM
Format a timestamp into human‐readable AM/PM time
```typescript
timeAMPM(timestamp: number | string): string
```

### Full Date Text
Format into full date string (day, month, year etc.)
```typescript
fullDateText(timestamp: number | string): string
```

### Truncate Text
Shorten text with ellipsis etc.
```typescript
truncateText(text: string, length: number): string
```


## Important Types

Here are major types exported:

* `BlockchainNetwork` — info about chain (name, chainId, etc.)
* `ChainIds` — supported chain IDs type
* `ChainIdsEnum` — supported chain IDs enum
* `EVMAddress` — string type representing valid Ethereum‐style address
* `ErrorResponse` — structure returned when some contract interaction fails
* `MerchantConfigParams` — config input object (RPCs, keys, suffixes, etc.)
* `PayTxsData` — data returned by `payTxs`
* `Payment, PaymentChain, PaymentData, PaymentDataAll` — various payment data shapes
* `ProductChain, ProductData, ProductDataAll` — product data shapes
* `TxObj` — transaction object type