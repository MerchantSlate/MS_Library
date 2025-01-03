import { ChainIds, EVMAddress, TokenData, TokenDataExtended } from "../types";
declare const 
/** Token Data (onchain) */
tokenOnchainData: (chain: ChainIds, tokenAddress: EVMAddress) => Promise<TokenData | undefined>, 
/** Token Logo (CoinGecko) */
getTokenLogo: (chain: ChainIds, tokenAddress: EVMAddress) => Promise<string | undefined>, 
/** Token Data */
getTokenData: (chain: ChainIds, tokenAddress: EVMAddress, skipLogo?: boolean) => Promise<TokenDataExtended | undefined>;
export { getTokenLogo, getTokenData, tokenOnchainData, };
