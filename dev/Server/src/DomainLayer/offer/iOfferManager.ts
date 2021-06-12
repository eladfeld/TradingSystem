import { Store } from "../store/Store";
import { StoreProduct } from "../store/StoreProduct";
import { Subscriber } from "../user/Subscriber";
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
    setStoreToRecieveOffers: (storeId: number) => Promise<void> ;
    setStoreToNotRecieveOffers: (storeId: number) => Promise<void> ;
    isRecievingOffers: (storeId: number) => Promise<boolean>;

    /**
     * OFFERS STATUS CHANGE AND CREATION
     * newOffer(user: Subscriber, storeId: number, product: StoreProduct, offerPrice: number): Promise<void>
     */
    newOffer: (user: Subscriber, storeId: number, product: StoreProduct, offerPrice: number) => Promise<number> ;
    acceptOffer: (subscriber: Subscriber, store: Store, offerId: number) => Promise<void> ; // WHEN ALL OWNERS ACCEPT CHANGE OFFER STATUS TO ACCEPTED
    declineOffer: (userid: number, storeId: number, offerId: number) => Promise<void> ;
    counterOffer: (userid: number, storeId: number, offerId: number, counterPrice: number) => Promise<void> ;

    /**
     * ALERTS
     */
    sendOfferAlertToOwners: (storeId: number, offerId: number) => Promise<void> ;
    sendOfferAlertToBuyer: (userId: number, offerId: number) => Promise<void> ;
    sendRecievedSupplyAlertToBuyer: (userId: number, offerId: number) => Promise<void> ; // (OPTIONAL ?) IF OFFER STATE IS ACCEPTED AND SOLD OUT CHANGE IT TO ACCEPTED AND SEND ALERT

    /**
     * OFFERS PAGE INFO FOR UI
     */
    getOffersByStore: (storeId: number) => Promise<Offer[]>; // SEND ONLY OFFERS THAT WERE NOT DECLINED
    getOffersByUser: (userId: number) => Promise<Offer[]>;

    /**
     * OFFERS BUYING
     */
    getAcceptedOffersByUser: (userId: number) => Promise<Offer[]>; // CHECK QUANTITY IS STILL AVAILABLE
    reserveAcceptedOffersByUser: (userId: number) => Promise<void> ;
    clearAcceptedOffersByUser: (userId: number) => Promise<Offer[]>;
    removeAcceptedOffer: (offerId: number) => Promise<void> ;
}