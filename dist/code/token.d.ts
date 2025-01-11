import { ChainIds, EVMAddress, TokenData, TokenDataExtended } from "../types";
declare const 
/** Token Data (onchain) */
tokenOnchainData: (chain: ChainIds, tokenAddress: EVMAddress) => Promise<TokenData | undefined>, 
/** Token Logo (CoinGecko) */
getTokenLogo: (chain: ChainIds, tokenAddress: EVMAddress) => Promise<string | undefined>, 
/** Token Data */
getTokenData: (chain: ChainIds, tokenAddress: EVMAddress, skipLogo?: boolean) => Promise<TokenDataExtended | undefined>, 
/** Token Rate */
getTokenRate: ({ chain, tokenAddress, referenceAddress, weiAmount, }: {
    chain: ChainIds;
    tokenAddress: EVMAddress;
    referenceAddress: EVMAddress;
    weiAmount: string;
}) => Promise<string | undefined>, 
/** Token Price (USD) */
getTokenUSDValue: ({ chain, tokenAddress, weiAmount, }: {
    chain: ChainIds;
    tokenAddress: EVMAddress;
    weiAmount: string;
}) => Promise<string | undefined>;
export { getTokenLogo, getTokenData, tokenOnchainData, getTokenRate, getTokenUSDValue, };
