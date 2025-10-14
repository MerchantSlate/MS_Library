
## MerchantSlate SDK - Change Log

### 14 October 2025
* `config` accepts array of RPCs to be used in same order (if any fails)
* `validationRange` optional parameter added for `payValidation`
* `validRPCTime` added to configuration to control RPC re-validation interval

### 14 September 2025
* `SUPPORTED_CHAINS` exported constant for list of supported chains
* `ChainIdsEnum` exported for `ChainIds` type

### 9 August 2025
* `getTokenRate` now returns one token unit rate, without required `weiAmount`
* `tokenRateUSD`, `paidPriceUSD`, `paidTotalUSD`, `paidFeeUSD` added to `loadPayments` returned `paymentsData` array