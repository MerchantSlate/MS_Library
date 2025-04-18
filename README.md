# MerchantSlate - onchain crypto payment database

## Contract Deployed
Contract is currently deployed to 7 EVM chains
[More Info](https://github.com/MerchantSlate/Contract)

## Setup
Install using `yarn add merchantslate` or `npm install merchantslate` 

OR use in browsers through CDN

`<script src="https://cdn.jsdelivr.net/npm/merchantslate@0.4.0/dist/merchant.min.js"></script>`

Note: Public RPCs obtained from https://chainlist.org/ are used as default for development only and should be updated using `config`

```
merchant.config({
    /** wallet private key (optional) */
    walletPrivateKey:``,
    /**
    * wallet seed phrase (optional)
    * 
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