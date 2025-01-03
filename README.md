# MerchantSlate - onchain crypto payment database

## Setup
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