import { ChainIds, EVMAddress, ErrorResponse, StakeOffers } from "../types";
import { errorResponse } from "./contract";
import { getContract } from "./methods";

const
    /** Total Stakes */
    totalStakes = async (
        chain: ChainIds,
    ): Promise<number | ErrorResponse> => {
        try {
            const contract = await getContract(chain);
            return +(await contract.TotalStakes())?.toString();
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** wallet stake count */
    stakesCount = async (
        chain: ChainIds,
    ): Promise<{
        holdings: number,
        offered: number
    } | ErrorResponse> => {
        try {
            const
                contract = await getContract(chain, true),
                data = await contract.stakesCount(),
                holdings = +data?.[0]?.toString(),
                offered = +data?.[1]?.toString();
            return {
                holdings,
                offered
            };
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Transfer Stake */
    transferStake = async (
        chain: ChainIds,
        stakeUnits: string,
        recipientAddress: EVMAddress,
    ): Promise<string | ErrorResponse | undefined> => {
        try {
            const
                contract = await getContract(chain, true),
                tx = await contract.transferStake(stakeUnits, recipientAddress),
                hash = (await tx?.wait())?.hash;
            return hash
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Offer Stake  */
    offerStake = async (
        chain: ChainIds,
        stakeUnits: string,
        totalValueWei: string,
    ): Promise<string | ErrorResponse | undefined> => {
        try {
            const
                contract = await getContract(chain, true),
                tx = await contract.offerStake(stakeUnits, totalValueWei),
                hash = (await tx?.wait())?.hash;
            return hash
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Stakes Offered */
    stakesOffered = async (
        chain: ChainIds,
        wallet?: boolean,
    ): Promise<{
        listedStakes: StakeOffers,
        holderOffersCount: number,
    } | undefined> => {
        try {
            const
                contract = await getContract(chain, wallet),
                data = await contract.stakesOffered(),
                offerIdsRaw = data?.[0],
                offerValuesRaw = data?.[1],
                isHolderOfferRaw = data?.[2],
                holderOffersCount = +data?.[3]?.toString(),
                listedStakes: StakeOffers = {};
            for (let i = 0; i < offerIdsRaw?.length; i++) {
                const
                    offerId = offerIdsRaw?.[i]?.toString(),
                    offerValue = offerValuesRaw?.[i]?.toString(),
                    isHolderOffer: boolean = isHolderOfferRaw?.[i];
                listedStakes[offerId] = {
                    offerId,
                    offerValue,
                    isHolderOffer,
                };
            };
            return {
                listedStakes,
                holderOffersCount,
            };
        } catch (error: any) {
            return
        };
    },
    /** Remove stake offer */
    removeStakeOffer = async (
        chain: ChainIds,
        offerId: string,
    ): Promise<string | ErrorResponse | undefined> => {
        try {
            const
                list = (await stakesOffered(chain))?.listedStakes,
                isOffered = list?.[offerId];
            if (isOffered) {
                const
                    contract = await getContract(chain, true),
                    tx = await contract.removeStakeOffer(offerId),
                    hash = (await tx?.wait())?.hash;
                return hash
            };
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Take Stake */
    takeStake = async (
        chain: ChainIds,
        offerId: string,
    ): Promise<string | ErrorResponse | undefined> => {
        try {
            const
                contract = await getContract(chain, true),
                list = (await stakesOffered(chain))?.listedStakes,
                value = list?.[offerId]?.offerValue;
            if (value) {
                const
                    tx = await contract.takeStake(
                        offerId,
                        { value }
                    ),
                    hash = (await tx?.wait())?.hash;
                return hash
            };
        } catch (error: any) {
            return errorResponse(error);
        };
    };

export {
    totalStakes,
    stakesCount,
    transferStake,
    offerStake,
    stakesOffered,
    takeStake,
    removeStakeOffer,
}