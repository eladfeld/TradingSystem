import { StoreDB } from '../../DataAccessLayer/DBinit';
import { iOfferManager } from './iOfferManager'
import { Offer } from './Offer';

export class OfferManager implements iOfferManager {

    newOffer: (userid: number, storeId: number, productId: number, offer: number) => Promise<void>;
    acceptOffer: (userid: number, storeId: number, offerId: number) => Promise<void>;
    declineOffer: (userid: number, storeId: number, offerId: number) => Promise<void>;
    counterOffer: (userid: number, storeId: number, offerId: number, counterPrice: number) => Promise<void>;
    sendOfferAlertToOwners: (storeId: number, offerId: number) => Promise<void>;
    sendOfferAlertToBuyer: (userId: number, offerId: number) => Promise<void>;
    sendRecievedSupplyAlertToBuyer: (userId: number, offerId: number) => Promise<void>;
    getOffersByStore: (storeId: number) => Promise<Offer[]>;
    getOffersByUser: (userId: number) => Promise<Offer[]>;
    getAcceptedOffersByUser: (userId: number) => Promise<Offer[]>;
    reserveAcceptedOffersByUser: (userId: number) => Promise<void>;
    clearAcceptedOffersByUser: (userId: number) => Promise<Offer[]>;
    removeAcceptedOffer: (offerId: number) => Promise<void>;


    getUserOfferPrice: () => number;
    getProductPrice: () => number;

    public async setStoreToRecieveOffers(storeId: number): Promise<void> {
        await StoreDB.updateStoreRecievesOffers(storeId, true);
    }

    public async setStoreToNotRecieveOffers(storeId: number): Promise<void> {
        await StoreDB.updateStoreRecievesOffers(storeId, false);
    }

    public async isRecievingOffers(storeId: number): Promise<boolean> {
        return StoreDB.getRecievingOffers(storeId);
    }


}