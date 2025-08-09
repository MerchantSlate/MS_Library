import { ChainIds, EVMAddress, TokenData, TokenDataExtended } from "../types";
declare const 
/** Token Data (onchain) */
tokenOnchainData: (chain: ChainIds, tokenAddress: EVMAddress) => Promise<TokenData | undefined>, 
/** Token Logo (CoinGecko) */
getTokenLogo: (chain: ChainIds, tokenAddress: EVMAddress) => Promise<string | undefined>, 
/** Token Data */
getTokenData: (chain: ChainIds, tokenAddress: EVMAddress, skipLogo?: boolean) => Promise<TokenDataExtended | undefined>, 
/** Token Rate in Ref. Token (Default Ref.: USDT) */
getTokenRate: ({ chain, tokenAddress, referenceAddress, referenceDecimals, }: {
    chain: ChainIds;
    tokenAddress: EVMAddress;
    referenceAddress?: EVMAddress;
    referenceDecimals?: number;
}) => Promise<string>;
export { getTokenLogo, getTokenData, tokenOnchainData, getTokenRate, };
