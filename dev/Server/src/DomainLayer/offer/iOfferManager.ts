import { Offer } from "./Offer";

export interface iOfferManager {
    /**
     * GETTERS
     */
    getUserOfferPrice: () => number;
    getProductPrice: () => number;

    /**
     * STORE OFFERS POLICY
     */
    setStoreToRecieveOffers: (storeId: number) => void;
    setStoreToNotRecieveOffers: (storeId: number) => void;
    isRecieveingOffers: (storeId: number) => boolean;

    /**
     * OFFERS STATUS CHANGE AND CREATION
     */
    newOffer: (userid: number, storeId: number, productId: number, offer: number) => void;
    acceptOffer: (userid: number, storeId: number, offerId: number) => void; // WHEN ALL OWNERS ACCEPT CHANGE OFFER STATUS TO ACCEPTED
    declineOffer: (userid: number, storeId: number, offerId: number) => void;
    counterOffer: (userid: number, storeId: number, offerId: number, counterPrice: number) => void;

    /**
     * ALERTS
     */
    sendOfferAlertToOwners: (storeId: number, offerId: number) => void;
    sendOfferAlertToBuyer: (userId: number, offerId: number) => void;
    sendRecievedSupplyAlertToBuyer: (userId: number, offerId: number) => void; // (OPTIONAL ?) IF OFFER STATE IS ACCEPTED AND SOLD OUT CHANGE IT TO ACCEPTED AND SEND ALERT

    /**
     * OFFERS PAGE INFO FOR UI
     */
    getOffersByStore: (storeId: number) => Promise<Offer[]>; // SEND ONLY OFFERS THAT WERE NOT DECLINED
    getOffersByUser: (userId: number) => Promise<Offer[]>;

    /**
     * OFFERS BUYING
     */
    getAcceptedOffersByUser: (userId: number) => Promise<Offer[]>; // CHECK QUANTITY IS STILL AVAILABLE
    reserveAcceptedOffersByUser: (userId: number) => void;
    clearAcceptedOffersByUser: (userId: number) => Promise<Offer[]>;
    removeAcceptedOffer: (offerId: number) => void;
}