import { DB } from "../../DataAccessLayer/DBfacade";
import { Logger } from "../../Logger";
import { ID } from "../store/Common";

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
        this.offerId = ID();
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
        return DB.addOffer(offer);
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

    public acceptOffer(userId: number) : number[]{
        if(this.offerStatus == OfferStatus.PENDING || this.offerStatus == OfferStatus.COUNTER){
            if(!this.ownersAccepted.includes(userId)){
                this.ownersAccepted.push(userId);
            }
            return this.ownersAccepted;
        }
        Logger.log("Offer status is no longer pending");
        return [];
    }

    public changeStatusToDecline(){
        if(this.offerStatus == OfferStatus.PENDING || this.offerStatus == OfferStatus.COUNTER){
            this.offerStatus = OfferStatus.DECLINED;
            return true;

        }
        Logger.log("could not change offer status declined");
        return false;

    }

    public changeStatusToAccepted() : boolean{
        if(this.offerStatus == OfferStatus.PENDING || this.offerStatus == OfferStatus.COUNTER){
            this.offerStatus = OfferStatus.ACCEPTED;
            return true;
        }
        Logger.log("could not change offer status accepted");
        return false;
    }

    public changeStatusToAcceptedButSoldOut() : boolean{
        if(this.offerStatus == OfferStatus.PENDING || this.offerStatus == OfferStatus.COUNTER){
            this.offerStatus = OfferStatus.ACCEPTED_AND_SOLD_OUT;
            return true;
        }
        Logger.log("could not change offer status accepted but sold out");
        return false;
    }

    public changeStatusToCounter(counterPrice: number) : boolean{
        if(this.offerStatus == OfferStatus.PENDING){
            this.counterPrice = counterPrice
            this.offerStatus = OfferStatus.COUNTER;
            return true;
        }
        Logger.log("could not counter offer");
        return false;
    }


    public getOfferId = () => this.offerId;
    public getUserId = () => this.userId;
    public getUsername = () => this.username;
    public getStoreId = () => this.storeId;
    public getProductId = () => this.productId;
    public getProductName = () => this.productName
    public getOfferPrice = () => this.offerPrice;
    public getCounterPrice = () => this.counterPrice;
    public getOfferStatus = () => this.offerStatus;
    public getOwnersAccepted = () => this.ownersAccepted;



}
