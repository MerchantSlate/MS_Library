# MerchantSlate - onchain crypto payment database

## Contract Deployed
Contract is currently deployed to 7 EVM chains
Address `0xd680762e0E498aAfD200545307000eFf12e8E638`
1. [BNB Chain](https://bscscan.com/address/0xd680762e0E498aAfD200545307000eFf12e8E638#code)
2. [AVAX C-Chain](https://snowscan.xyz/address/0xd680762e0e498aafd200545307000eff12e8e638#code)
3. [Arbitum](https://arbiscan.io/address/0xd680762e0E498aAfD200545307000eFf12e8E638#code)
4. [Optimism](https://optimistic.etherscan.io/address/0xd680762e0E498aAfD200545307000eFf12e8E638#code)
5. [Fantom](https://ftmscan.com/address/0xd680762e0E498aAfD200545307000eFf12e8E638#code)
6. [CELO](https://celoscan.io/address/0xd680762e0E498aAfD200545307000eFf12e8E638#code)
7. [Polygon](https://www.oklink.com/polygon/address/0xd680762e0e498aafd200545307000eff12e8e638/contract)

## Setup
Install using `yarn add merchantslate` or `npm install merchantslate` 

OR use in browsers through CDN
`<script src="https://cdn.jsdelivr.net/npm/merchantslate@0.0.6/dist/merchant.min.js"></script>`

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