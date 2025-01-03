import { ChainIds, EVMAddress, ErrorResponse, StakeOffers } from "../types";
declare const 
/** Total Stakes */
totalStakes: (chain: ChainIds) => Promise<number | ErrorResponse>, 
/** wallet stake count */
stakesCount: (chain: ChainIds) => Promise<{
    holdings: number;
    offered: number;
} | ErrorResponse>, 
/** Transfer Stake */
transferStake: (chain: ChainIds, stakeUnits: string, recipientAddress: EVMAddress) => Promise<string | ErrorResponse | undefined>, 
/** Offer Stake  */
offerStake: (chain: ChainIds, stakeUnits: string, totalValueWei: string) => Promise<string | ErrorResponse | undefined>, 
/** Stakes Offered */
stakesOffered: (chain: ChainIds, wallet?: boolean) => Promise<{
    listedStakes: StakeOffers;
    holderOffersCount: number;
} | undefined>, 
/** Remove stake offer */
removeStakeOffer: (chain: ChainIds, offerId: string) => Promise<string | ErrorResponse | undefined>, 
/** Take Stake */
takeStake: (chain: ChainIds, offerId: string) => Promise<string | ErrorResponse | undefined>;
export { totalStakes, stakesCount, transferStake, offerStake, stakesOffered, takeStake, removeStakeOffer, };
