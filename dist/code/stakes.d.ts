import { ChainIds, EVMAddress, ResultPromise, StakeOffers } from "../types";
declare const 
/** Total Stakes */
totalStakes: (chain: ChainIds) => ResultPromise<number>, 
/** wallet stake count */
stakesCount: (chain: ChainIds) => ResultPromise<{
    holdings: number;
    offered: number;
}>, 
/** Transfer Stake */
transferStake: (chain: ChainIds, stakeUnits: string, recipientAddress: EVMAddress) => ResultPromise<string>, 
/** Offer Stake  */
offerStake: (chain: ChainIds, stakeUnits: string, totalValueWei: string) => ResultPromise<string>, 
/** Stakes Offered */
stakesOffered: (chain: ChainIds, wallet?: boolean) => Promise<{
    listedStakes: StakeOffers;
    holderOffersCount: number;
} | undefined>, 
/** Remove stake offer */
removeStakeOffer: (chain: ChainIds, offerId: string) => ResultPromise<string>, 
/** Take Stake */
takeStake: (chain: ChainIds, offerId: string) => ResultPromise<string>;
export { totalStakes, stakesCount, transferStake, offerStake, stakesOffered, removeStakeOffer, takeStake, };
