
## MerchantSlate SDK - Change Log

### 1.1.0
* `getTokenLogo` added to `config`
* `TokenLogoResolver` type is exported

### 0.7.3
* `walletAddress` is now optional in `payValidation`
* `validationRange` optional parameter added for `payValidation`
* `config` accepts array of RPCs to be used in same order (if any fails)
* `validRPCTime` added to configuration to control RPC re-validation interval

### 0.6.7
* `SUPPORTED_CHAINS` exported constant for list of supported chains
* `ChainIdsEnum` exported for `ChainIds` type

### 0.5.7
* `getTokenRate` now returns one token unit rate, without required `weiAmount`
* `tokenRateUSD`, `paidPriceUSD`, `paidTotalUSD`, `paidFeeUSD` added to `loadPayments` returned `paymentsData` array