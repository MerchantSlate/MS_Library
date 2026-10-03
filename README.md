# MerchantSlate SDK

**Onchain crypto payment database SDK for EVM chains — accept crypto payments, manage products, register merchants, run staking, and fetch live token rates in TypeScript for Node.js and the browser.**

![npm version](https://img.shields.io/npm/v/@merchantslate/legacy)
![license](https://img.shields.io/npm/l/@merchantslate/legacy)
![types](https://img.shields.io/npm/types/@merchantslate/legacy)
![node](https://img.shields.io/node/v/@merchantslate/legacy)
![chains](https://img.shields.io/badge/chains-9-blue)
![modules](https://img.shields.io/badge/modules-ESM%20%2B%20CommonJS-success)

MerchantSlate SDK is a TypeScript library for onchain crypto payment databases. It supports front-end and back-end solutions across popular EVM chains and enables merchant registration, product management, payment processing, staking, and utility functions like fetching live token rates and onchain token data (for example, price in USDT). Install via npm, yarn, pnpm, or a browser CDN, and customize it with your own RPCs.

> This package supersedes the deprecated [`merchantslate`](https://www.npmjs.com/package/merchantslate) package.

## Table of Contents

- [Why MerchantSlate](#why-merchantslate)
- [Install](#install)
- [Quick Start](#quick-start)
- [Supported Chains](#supported-chains)
- [Configuration](#configuration)
- [Token](#token)
- [Merchant](#merchant)
- [Products](#products)
- [Payments](#payments)
- [Stakes](#stakes)
- [Wallet & Provider](#wallet--provider)
- [Formatting Utilities](#formatting-utilities)
- [Types](#types)
- [FAQ](#faq)
- [Keywords](#keywords)
- [Links](#links)

## Why MerchantSlate

- **Multi-chain by default** — Ethereum, Aptos, BNB Smart Chain, Polygon, Avalanche, Fantom, Arbitrum, Optimism and Celo behind one `ChainIds` type.
- **Full payment lifecycle** — register as a merchant, list products, build payment transactions, validate payments and read payment history.
- **Onchain token data & rates** — resolve token metadata (symbol, name, decimals, logo) and live rates relative to USDT.
- **Staking built in** — offer, transfer, take and remove stake offers directly from your app.
- **Node.js and browser** — dual UMD browser and CommonJS Node builds, with a `merchant` browser global.
- **TypeScript-first** — complete type definitions for configs, products, payments, stakes and errors.
- **Wallet-agnostic** — connect a browser wallet (MetaMask and friends) or run headless with a private key / seed phrase.
- **Production-ready caching** — built-in RPC, token and rate caching to keep reads fast and cheap.

## Install

Using npm:

```bash
npm install @merchantslate/legacy
```

Using yarn:

```bash
yarn add @merchantslate/legacy
```

Using pnpm:

```bash
pnpm add @merchantslate/legacy
```

Or use it in browsers through a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@merchantslate/legacy@1.3.0/dist/browser/merchant.min.js"></script>
```

`merchant` is the browser global object exposing all library functions.

## Quick Start

```typescript
import {
  config,
  ChainIdsEnum,
  merchantSignup,
  addProduct,
  loadProducts,
  payProduct,
  getTokenRate,
  ZERO_ADDRESS,
} from "@merchantslate/legacy";

// 1. Configure RPCs (and optionally a wallet for headless/server use)
config({
  BSC_RPC: "https://your-bsc-rpc.example",
  POLYGON_RPC: ["https://your-polygon-rpc-1.example", "https://your-polygon-rpc-2.example"],
});

// 2. Register the connected wallet as a merchant on BSC
const signup = await merchantSignup(ChainIdsEnum.BSC);
if (signup.success) {
  console.log("Merchant id:", signup.data.merchantId);
}

// 3. Add a product priced in USDT
const product = await addProduct({
  chain: ChainIdsEnum.BSC,
  productPrice: "19.99",
  tokenAddress: "0x55d398326f99059ff775485246999027b3197955", // BSC USDT
  quantity: "100",
});
if (product.success) {
  console.log(product.data.isNew ? "Created" : "Updated", product.data.productId);
}

// 4. List products with presentation-ready fields
const listing = await loadProducts({
  chain: ChainIdsEnum.BSC,
  pageNo: "0",
  pageSize: "10",
});
console.log(listing.productsData, listing.currentPage, listing.totalPages);

// 5. Pay for a product
const payment = await payProduct(
  ChainIdsEnum.BSC,
  { id: "1", token: "0x55d398326f99059ff775485246999027b3197955", amount: "19990000", qty: "100", qtyCap: false, chain: ChainIdsEnum.BSC },
  "1"
);
if (payment.success) console.log("Paid:", payment.data.hash, payment.data.paymentId);

// 6. Read a live token rate (native BNB priced in USD/USDT)
const bnbPrice = await getTokenRate({ chain: ChainIdsEnum.BSC, tokenAddress: ZERO_ADDRESS });
console.log("BNB:", bnbPrice);
```

Server-side / headless signing:

```typescript
import { config, ChainIdsEnum, merchantSignup } from "@merchantslate/legacy";

config({
  BSC_RPC: "https://your-bsc-rpc.example",
  walletPrivateKey: process.env.WALLET_PRIVATE_KEY, // or walletSeedPhrase
});

await merchantSignup(ChainIdsEnum.BSC);
```

## Supported Chains

`SUPPORTED_CHAINS` is the runtime list; `ChainIds` is the matching TypeScript type and `ChainIdsEnum` its enum-like object.

| Chain (`ChainIds`) | Chain ID | Native currency | Deployed |
|--------------------|----------|-----------------|----------|
| `ETH` | `0x1` | ETH | No |
| `APT` | `1400` | APT | No |
| `BSC` | `0x38` | BNB | Yes |
| `POLYGON` | `0x89` | POL | Yes |
| `AVALANCHE` | `0xa86a` | AVAX | Yes |
| `FANTOM` | `0xfa` | FTM | No |
| `ARBITRUM` | `0xa4b1` | ETH | Yes |
| `OPTIMISM` | `0xa` | ETH | Yes |
| `CELO` | `0xa4ec` | cUSD | Yes |

```typescript
import { SUPPORTED_CHAINS, ChainIdsEnum } from "@merchantslate/legacy";

SUPPORTED_CHAINS; // ["ETH", "APT", "BSC", "POLYGON", "AVALANCHE", "FANTOM", "ARBITRUM", "OPTIMISM", "CELO"]
ChainIdsEnum.BSC;  // "BSC"
```

## Configuration

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `config` | `data?: MerchantConfigParams` | `void` | Apply RPCs, wallet, suffixes, contract address and log settings. |
| `getConfig` | — | `MerchantConfigBasics` | Returns the current configuration object. |
| `getChainsData` | — | `SupportedChainsData` | Returns chain metadata keyed by `ChainIds`. |
| `setSelectedChain` | `chain: ChainIds` | `void` | Sets the selected chain (cached in `localStorage` when available). |
| `selectedChain` | — | `ChainIds` | The currently selected chain ID. |

`MerchantConfigParams` accepts `{ChainId}_RPC` keys (one per supported chain) plus:

| Option | Type | Description |
|--------|------|-------------|
| `browserWallet` | `string` | Browser extension wallet address. |
| `walletPrivateKey` | `string` | Private key used when no wallet can be connected. |
| `walletSeedPhrase` | `string` | Seed phrase used when no wallet can be connected (cannot be combined with `walletPrivateKey`). |
| `billionSuffix` | `string` | Suffix used when formatting billions. |
| `millionSuffix` | `string` | Suffix used when formatting millions. |
| `merchantSlateContract` | `string` | MerchantSlate contract address (defaults to the deployed address). |
| `consoleLogEnabled` | `boolean` | Log contract errors (default `true`). |
| `validRPCTime` | `number` | RPC re-validation interval in ms (default `60000`). |
| `getTokenLogo` | `(chain, tokenAddress) => Promise<string \| undefined>` | Custom async token logo resolver used by `getTokenData`. |
| `BSC_RPC` (and other chains) | `string \| string[]` | RPC URL or ordered list of fallback RPC URLs for a chain. |

```typescript
import { config } from "@merchantslate/legacy";

config({
  BSC_RPC: "https://your-bsc-rpc.example",
  ARBITRUM_RPC: ["https://arb-1.example", "https://arb-2.example"],
  walletPrivateKey: "0x...",
  validRPCTime: 120000,
});
```

> Public RPCs from [chainlist.org](https://chainlist.org/) are bundled as defaults for development only. Replace them with your own via `config`.

Token logos are resolved by `getTokenData` from the custom `getTokenLogo` function, falling back to the chain logo. You can supply your own resolver:

```typescript
import { config } from "@merchantslate/legacy";

config({
  BSC_RPC: "https://your-bsc-rpc.example",
  // Example: resolve token logos from your own API/CDN
  getTokenLogo: async (chain, tokenAddress) => {
    const response = await fetch(
      `https://your-api.example/token-logos/${chain}/${tokenAddress}`
    );
    if (!response.ok) return undefined;
    const data = await response.json();
    return data.logoUrl; // e.g. "https://your-cdn.example/usdt.png"
  },
});
```

Other exported values: `ZERO_ADDRESS: EVMAddress` and `contractErrors: Record<string, string>` (readable messages for contract error codes).

## Token

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `getTokenData` | `chain`, `tokenAddress`, `skipLogo?` | `Promise<TokenDataExtended \| undefined>` | Onchain token metadata (address, name, symbol, decimals) with a logo resolved from the custom `getTokenLogo`, then the chain logo. |
| `tokenOnchainData` | `chain`, `tokenAddress` | `Promise<TokenData \| undefined>` | Raw onchain token metadata without the logo lookup. |
| `getTokenRate` | `{ chain, tokenAddress, referenceAddress?, referenceDecimals? }` | `Promise<number>` | Current rate of a token relative to a reference token. Defaults to the chain's USDT, so the value is effectively the price in USD. |

```typescript
import { getTokenData, getTokenRate, ChainIdsEnum, ZERO_ADDRESS } from "@merchantslate/legacy";

const bnb = await getTokenData(ChainIdsEnum.BSC, ZERO_ADDRESS);
// { symbol: "BNB", name: "Binance Coin", decimals: 18, logo: "...", address: "0x0000..." }

const bnbPriceUsd = await getTokenRate({
  chain: ChainIdsEnum.BSC,
  tokenAddress: ZERO_ADDRESS,
});
// 600.25
```

## Merchant

All merchant functions return a `Result<T>` — either `{ success: true, data: T }` or `ErrorResponse`.

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `merchantFee` | `chain` | `ResultPromise<string>` | Fee required to register as a merchant (wei string). |
| `merchantFeeValueText` | `chain` | `ResultPromise<string>` | Same fee formatted as human-readable native value and USD estimate. |
| `merchantSignup` | `chain` | `ResultPromise<{ hash?: string; merchantId?: string }>` | Register the connected wallet as a merchant and return the transaction hash and merchant id. |
| `getMerchantId` | `chain` | `ResultPromise<string>` | Merchant id of the connected wallet (cached per wallet and chain). |

```typescript
import { merchantFeeValueText, merchantSignup, ChainIdsEnum } from "@merchantslate/legacy";

const feeText = await merchantFeeValueText(ChainIdsEnum.BSC);
// BNB 0.01 ~ $6.25

const signup = await merchantSignup(ChainIdsEnum.BSC);
if (signup.success) console.log(signup.data.merchantId);
```

## Products

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `productFee` | `chain` | `ResultPromise<string>` | Fee to add or update a product (wei string). |
| `productFeeText` | `chain` | `ResultPromise<string>` | Product fee formatted as human-readable native value and USD estimate. |
| `addProduct` | `ProductParams` | `ResultPromise<ProductUpdateResponse>` | Add a new product and return `{ hash, productId, isNew: true }`. |
| `updateProduct` | `ProductParams` | `ResultPromise<ProductUpdateResponse>` | Add or update a product (pass `productId` to update). |
| `deleteProduct` | `chain`, `productId` | `ResultPromise<string>` | Delete a product and return the transaction hash. |
| `getProducts` | `chain`, `pageNo`, `pageSize`, `merchantId?` | `Promise<{ products?: Product[]; total?: number }>` | Raw products with pagination and optional merchant filter. |
| `getProductDetails` | `chain`, `productId` | `ResultPromise<ProductExtended>` | Full details for a single product plus token info and USD value. |
| `loadProducts` | `{ chain, pageNo, pageSize, isMerchantOnly? }` | `Promise<ProductDataAll>` | Presentation-ready products with logos, formatted prices and pagination. |

`ProductParams` = `{ chain, productPrice, productId?, tokenAddress?, quantity?, commissionAddress?, commissionPercentage? }`.

```typescript
import { addProduct, loadProducts, ChainIdsEnum } from "@merchantslate/legacy";

const added = await addProduct({
  chain: ChainIdsEnum.BSC,
  productPrice: "19.99",
  tokenAddress: "0x55d398326f99059ff775485246999027b3197955",
  quantity: "100",
  commissionPercentage: "2",
  commissionAddress: "0xYourCommissionWallet",
});
// { isNew: true, productId: "1", hash: "0x..." }

const products = await loadProducts({
  chain: ChainIdsEnum.BSC,
  pageNo: "0",
  pageSize: "10",
  isMerchantOnly: true,
});
```

## Payments

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `payValueText` | `chain`, `product`, `quantity?` | `Promise<string \| undefined>` | Human-readable payment value for a product and quantity. |
| `payProduct` | `chain`, `product`, `quantity?` | `ResultPromise<{ hash?: string; paymentId?: string }>` | Pay for a product (handles ERC-20 approval automatically). |
| `payTxs` | `chain`, `productId`, `quantity?` | `ResultPromise<PayTxsData>` | Build unsigned approve/pay transactions for external signing. |
| `payValidation` | `{ chain, productId, walletAddress?, validationRange? }` | `ResultPromise<Payment>` | Verify that a matching payment exists for the product/wallet. |
| `getPayments` | `chain`, `pageNo`, `pageSize`, `merchantId?`, `connectedWallet?` | `Promise<{ payments?: Payment[]; total?: number }>` | Raw payments with pagination and optional merchant/wallet filters. |
| `loadPayments` | `{ chain, pageNo, pageSize, isMerchantOnly?, buyerWallet? }` | `Promise<PaymentDataAll>` | Presentation-ready payments with token data, USD values and pagination. |

```typescript
import { getPayments, loadPayments, payTxs, ChainIdsEnum } from "@merchantslate/legacy";

const txs = await payTxs(ChainIdsEnum.BSC, "1", "1");
if (txs.success) {
  // txs.data = { chainId, token, amount, txs: [{ to, data, value? }] }
}

const history = await loadPayments({
  chain: ChainIdsEnum.BSC,
  pageNo: "0",
  pageSize: "10",
  isMerchantOnly: true,
});
```

## Stakes

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `totalStakes` | `chain` | `ResultPromise<number>` | Total stake units on the contract. |
| `stakesCount` | `chain` | `ResultPromise<{ holdings: number; offered: number }>` | Stakes held by the wallet and stakes offered. |
| `offerStake` | `chain`, `stakeUnits`, `totalValueWei` | `ResultPromise<string>` | Offer stake units for public purchase. |
| `stakesOffered` | `chain`, `wallet?` | `Promise<{ listedStakes: StakeOffers; holderOffersCount: number } \| undefined>` | List stake offers, optionally only for the connected wallet. |
| `transferStake` | `chain`, `stakeUnits`, `recipientAddress` | `ResultPromise<string>` | Transfer stake units to another address. |
| `takeStake` | `chain`, `offerId` | `ResultPromise<string>` | Take an existing stake offer by id. |
| `removeStakeOffer` | `chain`, `offerId` | `ResultPromise<string>` | Remove a previously created stake offer. |

```typescript
import { stakesCount, stakesOffered, offerStake, ChainIdsEnum } from "@merchantslate/legacy";

const counts = await stakesCount(ChainIdsEnum.BSC);
if (counts.success) console.log(counts.data.holdings, counts.data.offered);

const offers = await stakesOffered(ChainIdsEnum.BSC, true);
```

## Wallet & Provider

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `getBrowserWallet` | — | `any` | Returns the injected browser wallet (`window.ethereum`) or `undefined`. |
| `getProvider` | `chain`, `wallet?` | `Promise<Provider \| undefined>` | Returns a browser or JSON-RPC provider, validating RPCs and caching the working one. |
| `getContract` | `chain`, `wallet?`, `address?`, `abi?` | `Promise<Contract>` | Returns a signed/read-only contract instance for the chain. |
| `getWalletAddress` | `chain` | `Promise<EVMAddress \| undefined>` | Address of the connected wallet, if any. |

## Formatting Utilities

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `integerString` | `value: number \| string` | `string` | Normalize a number into an integer string (no decimals). |
| `toWei` | `value: string`, `decimals?` | `string` | Convert units to wei (or the smallest unit). |
| `fromWei` | `value: string`, `decimals?` | `number` | Convert wei back into human-readable units. |
| `processNumbers` | `input: number \| string \| bigint`, `roundingLimit?` | `string` | Format numbers with commas, rounding and million/billion suffixes. |
| `timeAMPM` | `timestamp: number \| string \| Date` | `string` | Format a timestamp as AM/PM time, e.g. `02:30PM`. |
| `fullDateText` | `timestamp: number \| string \| Date` | `string` | Format a timestamp as a full date, e.g. `23 June 2022`. |
| `truncateText` | `text: string`, `limit?` | `string` | Shorten text in the middle with an ellipsis. |

## Types

Exported TypeScript types:

| Type | Description |
|------|-------------|
| `ChainIds` | Union of supported chain IDs (`"BSC"`, `"POLYGON"`, ...). |
| `ChainIdsEnum` | Enum-like object mapping each `ChainIds` to itself. |
| `EVMAddress` | Template literal type for `0x`-prefixed Ethereum addresses. |
| `BlockchainNetwork` | Chain metadata (chain id, native currency, RPCs, explorer, logo). |
| `MerchantConfigParams` | Input object for `config`. |
| `ErrorResponse` | `{ success: false; errorCode; errorNote }` returned on failures. |
| `ProductChain`, `ProductData`, `ProductDataAll` | Product shapes for raw, chain-tagged and presentation data. |
| `Payment`, `PaymentChain`, `PaymentData`, `PaymentDataAll` | Payment shapes for raw, chain-tagged and presentation data. |
| `PayTxsData`, `TxObj` | Data returned by `payTxs` and the individual transaction objects. |

## FAQ

**What is MerchantSlate SDK?**
A TypeScript SDK for an onchain crypto payment database. It lets you register merchants, manage products, accept payments, run staking and read token data and rates across supported EVM chains.

**Is it free?**
Yes. The SDK is open source under the MIT license. Onchain operations still cost normal network gas and any contract fees.

**Does it work in the browser and Node.js?**
Yes. It ships a UMD browser build (`dist/browser/merchant.min.js`, global `merchant`) and a CommonJS Node build (`dist/node/merchant.node.min.js`).

**Can I use it headlessly without a browser wallet?**
Yes. Pass `walletPrivateKey` or `walletSeedPhrase` to `config`; otherwise it falls back to a connected browser wallet.

**Is it TypeScript-friendly?**
Yes. It is written in TypeScript and ships full type definitions along with the runtime.

**Which framework does it support?**
Framework-agnostic. Use it in React, Vue, Svelte, Angular, Node services, scripts or plain HTML.

**What dependencies does it have?**
Runtime dependencies are [`ethers`](https://www.npmjs.com/package/ethers) v6 and [`node-fetch`](https://www.npmjs.com/package/node-fetch) v3.

**Which chains are supported?**
ETH, APT, BSC, POLYGON, AVALANCHE, FANTOM, ARBITRUM, OPTIMISM and CELO. See [Supported Chains](#supported-chains) for deployment status.

**Do I need my own RPC?**
Public RPCs are bundled for development only. For production, provide your own via `config` (one URL or an ordered fallback list per chain).

**How are errors returned?**
Onchain actions return a `Result<T>`: `{ success: true, data }` on success or an `ErrorResponse` (`errorCode`, `errorNote`) on failure.

## Keywords

onchain crypto payment, crypto payment SDK, crypto payment gateway, EVM payment library, web3 payments, accept crypto payments, crypto checkout, payment database, merchant SDK, product catalog onchain, smart contract payments, token price API, token rate, USDT price, ERC-20 payments, stablecoin payments, BNB Smart Chain, BSC, Polygon, Avalanche, Arbitrum, Optimism, Celo, Fantom, Ethereum, Aptos, multi-chain SDK, TypeScript, Node.js, browser, ethers.js, web3, dApp payments, onchain staking, crypto merchant.

## Links

- [Change Log](changes.md)
- [Deployed Contract](https://github.com/MerchantSlate/Contract)
- [Example Website](https://github.com/MerchantSlate/MS_Website)
- [Example Implementation](https://merchantslate.com)
- [GitHub Repository](https://github.com/MerchantSlate/MS_Library)
- [Issues](https://github.com/MerchantSlate/MS_Library/issues)

## License

MIT
