import { TokenLogoParams } from "../types";
declare const 
/** Resolve token logo (custom, onchain, tokenURI) */
resolveTokenLogo: ({ chain, tokenAddress, }: TokenLogoParams) => Promise<string | undefined>;
export { resolveTokenLogo, };
