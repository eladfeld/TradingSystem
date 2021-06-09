
export enum OfferStatus{
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    COUNTER = "COUNTER", // Store sent counter offer, buyer can accept or send a new offer with pending status and this offer will be rejected
    DECLINED = "DECLINED",
    ACCEPTED_AND_SOLD_OUT = "ACCEPTED AND SOLD OUT",
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
    private offerStatus: number;
    private ownersAccepted: number[];

}
