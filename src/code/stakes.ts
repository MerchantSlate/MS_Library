import {
    ChainIds,
    EVMAddress,
    ResultPromise,
    StakeOffers,
} from "../types";
import { errorResponse, processTxHash } from "./contract";
import { getContract } from "./methods";

const
    /** Total Stakes */
    totalStakes = async (
        chain: ChainIds,
    ): ResultPromise<number> => {
        try {
            const
                contract = await getContract(chain),
                data = +(await contract.TotalStakes())?.toString();
            if (!data) throw data
            return { success: true, data }
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** wallet stake count */
    stakesCount = async (
        chain: ChainIds,
    ): ResultPromise<{ holdings: number, offered: number }> => {
        try {
            const
                contract = await getContract(chain, true),
                raw = await contract.stakesCount(),
                holdings = +raw?.[0]?.toString(),
                offered = +raw?.[1]?.toString(),
                data = { holdings, offered };
            return { success: true, data };
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Transfer Stake */
    transferStake = async (
        chain: ChainIds,
        stakeUnits: string,
        recipientAddress: EVMAddress,
    ): ResultPromise<string> => {
        try {
            const
                contract = await getContract(chain, true),
                tx = await contract.transferStake(stakeUnits, recipientAddress);
            return processTxHash(tx);
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Offer Stake  */
    offerStake = async (
        chain: ChainIds,
        stakeUnits: string,
        totalValueWei: string,
    ): ResultPromise<string> => {
        try {
            const
                contract = await getContract(chain, true),
                tx = await contract.offerStake(stakeUnits, totalValueWei);
            return processTxHash(tx);
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
    ): ResultPromise<string> => {
        try {

            // check offer
            const
                res = await stakesOffered(chain),
                list = res?.listedStakes,
                isOffered = list?.[offerId];
            if (!isOffered) throw isOffered

            // remove offer
            const
                contract = await getContract(chain, true),
                tx = await contract.removeStakeOffer(offerId);
            return processTxHash(tx);
        } catch (error: any) {
            return errorResponse(error);
        };
    },
    /** Take Stake */
    takeStake = async (
        chain: ChainIds,
        offerId: string,
    ): ResultPromise<string> => {
        try {

            // check offer
            const
                contract = await getContract(chain, true),
                res = await stakesOffered(chain),
                list = res?.listedStakes,
                value = list?.[offerId]?.offerValue;
            if (!value) throw res

            // take offer
            const tx = await contract.takeStake(
                offerId,
                { value }
            );
            return processTxHash(tx);
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
    removeStakeOffer,
    takeStake,
}