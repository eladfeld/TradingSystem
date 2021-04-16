import { DiscountPolicy } from "./DiscountPolicy";
import { BuyingPolicy } from "./BuyingPolicy";
import { Inventory } from "./Inventory";
import { StoreProduct } from "./StoreProduct";
import {ID, Rating} from './Common'
import { Appointment } from "../user/Appointment";
import { isOk, makeFailure, makeOk, Result } from "../../Result";
import { StoreHistory } from "./StoreHistory";
import { StoreDB } from "./StoreDB";
import { StoreInfo } from "./StoreInfo";
import { Logger } from "../Logger";
import { BuyingOption } from "./BuyingOption";


export class Store
{

    public getStoreFounderId():number
    {
        return this.storeFounderId;
    }

    private storeId: number;
    private storeName: string;
    private storeFounderId: number;
    private discountPolicy: DiscountPolicy;
    private buyingPolicy: BuyingPolicy;
    private inventory: Inventory;
    private messages: Map<number, string>; // map userId (sender) to all of his messages
    private storeHistory: StoreHistory;
    private storeRating: number
    private numOfRaters: number

    public constructor(storeFounderId: number,storeName: string, discountPolicy = DiscountPolicy.default, buyingPolicy = BuyingPolicy.default)
    {
        this.storeId = ID();
        this.storeName = storeName;
        this.storeFounderId = storeFounderId;
        this.discountPolicy = new DiscountPolicy(discountPolicy);
        this.buyingPolicy = new BuyingPolicy(buyingPolicy);
        this.inventory = new Inventory();
        this.messages = new Map<number, string>()
        this.storeHistory = new StoreHistory(this.storeId, this.storeName, Date.now())
        this.storeRating = 0 // getting storeRating with numOfRaters = 0 will return NaN
        this.numOfRaters = 0
        StoreDB.addStore(this);
    }

    public getStoreId()
    {
        return this.storeId;
    }

    public getStoreName()
    {
        return this.storeName;
    }

    public setStoreId(id : number) : void
    {
        this.storeId = id;
    }

    public addStoreRating(rating : number) : Result<string>
    {
        if(!Object.values(Rating).includes(rating)){
            Logger.error(`Got invalid rating ${rating}`)
            return makeFailure("Got invalid rating")
        }
        this.storeRating *= this.numOfRaters
        this.numOfRaters++
        this.storeRating += rating
        this.storeRating /= this.numOfRaters
        Logger.log(`Rating was added new store rating: ${this.storeRating}`)
        return makeOk("Rating was added ")
    }

    public getStoreRating() : number
    {
        if(this.numOfRaters > 0){
            return this.storeRating
        }
        return NaN
    }

    public isProductAvailable(productId: number, quantity: number): Result<string> {
        return this.inventory.isProductAvailable(productId, quantity);
    }

    public addNewProduct(productName: string, category: string, price: number, quantity = 0): Result<string> {

        // we should check who calls this method is authorized
        return this.inventory.addNewProduct(productName, category, this.storeId, price, quantity);
    }

    public sellShoppingBasket(buyerId: number, productId: number, quantity: number): Result<string> {
        return makeFailure("Not implemented")

    }

    public cancelSoldShoppingBasket(buyerId: number, productId: number, quantity: number): Result<string> {
        return makeFailure("Not implemented")

    }

    public sellProduct(buyerId: number, productId: number, quantity: number, buyingOption: BuyingOption): Result<string> {

        // sell product should be called after policies where verified
        let sellResult =  this.inventory.sellProduct(productId, quantity);
        if(isOk(sellResult)){
            this.storeHistory.saveSale(buyerId, productId, quantity)
        }
        return sellResult
    }

    public buyInstant(): Result<string> {
        /**
         * Flow
         * check store supports option
         * check money/price according to discount policy
         * continue according ti option save offers and bids
         */
        return makeFailure("Not implemented")
    }

    public buyOffer(): Result<string> {
        return makeFailure("Not implemented")
    }

    public buyBid(): Result<string> {
        return makeFailure("Not implemented")
    }

    public buyRaffle(): Result<string> {
        return makeFailure("Not implemented")
    }

    public closeStore(): Result<string> {
        /**
         * Close bids delete products and delete store from db ?
         */
        return makeFailure("Not implemented")
    }

    public recieveMessage(userId: number, message: string): Result<string> {
        return makeFailure("Not implemented")
        // if(this.messages.has(userId)){
        //     this.messages.set(userId, this.messages.get(userId) + message)
        // } else {
        //     this.messages.set(userId, message)
        // }
        // return makeOk("Message recieved")
    }

    public readMessages(userId: number): Result<string> {
        // if(userId is authorized)
        // also add message class and keep track of read and answered messages, enable reading only unread messages or
        // a number of messages
        return makeFailure("Not implemented")
    }

    public ansewrMessage(userId: number, answer: string): Result<string> {
        // send answer somehow to user with userId
        return makeFailure("Not implemented")
    }

    public getStoreInfo(): StoreInfo {
        return new StoreInfo(this.getStoreName(), this.getStoreId(), this.inventory.getProductsInfo())
    }

    public addAppointment(appointment : Appointment) : void
    {}

    public deleteAppointment(appointment : Appointment) : void
    {}

    public getAppointments(): Appointment[]
    {return undefined}

    public openForImmediateBuy(productId : number) : boolean
    {return true;}

    public calculatePrice(products : Map<number,number>) : number
    {return 0;}

    private returnSoldProduct(productId: number, quantity: number): Result<string> {
        return this.inventory.returnSoldProduct(productId, quantity);
    }
}