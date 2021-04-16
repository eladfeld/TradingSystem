import { DiscountPolicy } from "./DiscountPolicy";
import { BuyingPolicy } from "./BuyingPolicy";
import { Inventory } from "./Inventory";
import { Product } from "./Product";
import {ID} from './Common'
import { Appointment } from "../user/Appointment";
import { makeFailure, makeOk, Result } from "../../Result";
import { StoreHistory } from "./StoreHistory";
import { StoreDB } from "./StoreDB";


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
    private messages: Map<number, string>;
    private storeHistory: StoreHistory;

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
        StoreDB.addStore(this);
    }

    public getStoreId()
    {
        return this.storeId;
    }

    public setStoreId(id : number) : void
    {
        this.storeId = id;
    }

    public isProductAvailable(productId: number, quantity: number): Result<string> {
        return this.inventory.isProductAvailable(productId, quantity);
    }

    public addNewProduct(productName: string, price: number, quantity = 0): Result<string> {

        // we should check who calls this method is authorized
        return this.inventory.addNewProduct(productName, this.storeId, price, quantity);
    }

    public sellProduct(buyerId: number, productId: number, quantity: number): Result<string> {

        // sell product should be called after policies where verified
        let sellResult =  this.inventory.sellProduct(productId, quantity);
        if(sellResult.tag == 'Ok'){
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

    public returnsoldProduct(productId: number, quantity: number): Result<string> {
        return this.inventory.returnsoldProduct(productId, quantity);
    }

    public closeStore(): Result<string> {
        /**
         * Close bids delete products and delete store from db ?
         */
        return makeFailure("Not implemented")
    }

    public recieveMessage(userId: number, message: string): Result<string> {
        if(this.messages.has(userId)){
            this.messages.set(userId, this.messages.get(userId) + message)
        } else {
            this.messages.set(userId, message)
        }
        return makeOk("Message recieved")
    }

    public readMessages(userId: number): Map<number, string> {
        // if(userId is authorized)
        return this.messages
    }

    public ansewrMessage(userId: number, answer: string): Result<string> {
        // send answer somehow to user with userId
        return makeFailure("Not implemented")
    }

    public addAppointment(appointment : Appointment) : void
    {}

    public deleteAppointment(appointment : Appointment) : void
    {}

    public getAppointments(): Appointment[]
    {return undefined}

    public openForImmediateAuction(productId : number) : boolean
    {return true;}

    public calculatePrice(products : Map<number,number>) : number
    {return 0;}
}