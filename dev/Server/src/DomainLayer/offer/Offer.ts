import { OfferDB } from "../../DataAccessLayer/DBinit";

export enum OfferStatus{
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    COUNTER = "COUNTER", // Store sent counter offer, buyer can accept or send a new offer with pending status and this offer will be rejected
    DECLINED = "DECLINED",
    ACCEPTED_AND_SOLD_OUT = "ACCEPTED AND SOLD OUT",
}

const offerStatusMapper: { [key: string]: OfferStatus } = {
    "PENDING": OfferStatus.PENDING,
    "ACCEPTED": OfferStatus.ACCEPTED,
    "COUNTER": OfferStatus.COUNTER,
    "DECLINED": OfferStatus.DECLINED,
    "ACCEPTED AND SOLD OUT": OfferStatus.ACCEPTED_AND_SOLD_OUT,
}

export class Offer {

    private offerId: number;
    private userId: number;
    private username: string;
    private storeId: number;
    private productId: number;
    private productName: string;
    private offerPrice: number;
    private counterPrice: number;
    private offerStatus: OfferStatus;
    private ownersAccepted: number[];

    private constructor(userId: number, username: string, storeId: number, productId:number, productName: string, offerPrice: number)
    {
        this.userId = userId;
        this.username = username;
        this.storeId = storeId;
        this.productId = productId;
        this.productName = productName;
        this.offerPrice = offerPrice;
        this.offerStatus = OfferStatus.PENDING;
        this.ownersAccepted = [];
    }

    public static createOffer(userId: number, username: string, storeId: number, productId:number, productName: string, offerPrice: number){
        let offer = new Offer(
            userId,
            username,
            storeId,
            productId,
            productName,
            offerPrice,
        )
        return OfferDB.addOffer(offer).then(_ => offer).catch(err => err);
    }

    public static rebuildOffer(id: number,
        userId: number,
        username: string,
        storeId: number,
        productId:number,
        productName: string,
        offerPrice: number,
        counterPrice: number,
        offerStatus: string,
        ownersAccepted: number[]){
        let offer = new Offer(
            userId,
            username,
            storeId,
            productId,
            productName,
            offerPrice,
        )
        offer.offerId = id;
        offer.counterPrice = counterPrice;
        offer.offerStatus = offerStatusMapper[offerStatus]
        offer.ownersAccepted = ownersAccepted;

        return offer;
    }

}
