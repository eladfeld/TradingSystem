import { DiscountPolicy } from "./DiscountPolicy";
import { BuyingPolicy } from "./BuyingPolicy";
import { Inventory } from "./Inventory";
import { StoreProduct } from "./StoreProduct";
import {ID, Rating} from './Common'
import { Appointment } from "../user/Appointment";
import { isFailure, isOk, makeFailure, makeOk, Result } from "../../Result";
import { StoreHistory } from "./StoreHistory";
import { StoreDB } from "./StoreDB";
import { StoreInfo, StoreProductInfo } from "./StoreInfo";
import { Logger } from "../Logger";
import { buyingOption, BuyingOption } from "./BuyingOption";
import { ShoppingBasket } from "../user/ShoppingBasket";
import Purchase from "../Purchase";


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
    private bankAccount: number
    private storeAddress: string

    public constructor(storeFounderId: number,storeName: string, bankAccount:number, storeAddress: string, discountPolicy = DiscountPolicy.default, buyingPolicy = BuyingPolicy.default)
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
        this.bankAccount = bankAccount;
        this.storeAddress = storeAddress;

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

    public sellShoppingBasket(buyerId: number, userAddress: string, shoppingBasket: ShoppingBasket): Result<string> {
        let productList = shoppingBasket.getProducts();
        let reservedProducts = new Map <number, number> ();
        for (let [id, quantity] of productList) {
            let sellResult = this.inventory.reserveProduct(id, quantity);
            if(isOk(sellResult)){
                reservedProducts.set(id,quantity);
            }
            else{
                for (let [id, quantity] of reservedProducts) {
                    this.inventory.returnReservedProduct(id, quantity);
                }
                return sellResult;
            }
        }
        let fixedPrice = this.calculatePrice(productList);

        Purchase.checkout(this, fixedPrice, buyerId, reservedProducts, userAddress);
        return makeOk("Checkout passed to purchase");
    }
    

    public cancelReservedShoppingBasket(buyerId: number, productId: number, quantity: number): Result<string> {
        return this.inventory.returnReservedProduct();
    }

    private buyingOptionsMenu = [this.buyInstant, this.buyOffer, this.buyBid, this.buyRaffle];
    
    public sellProduct(buyerId: number,userAddr: string, productId: number, quantity: number, buyingOption: BuyingOption): Result<string> {
        if(buyingOption.getBuyingOption() < this.buyingOptionsMenu.length && buyingOption.getBuyingOption() >= 0){
            return this.buyingOptionsMenu[buyingOption.getBuyingOption()](productId, quantity, buyerId, userAddr);
        }
        return makeFailure("Invalid buying option");
    }

    private buyInstant(productId:number, quantity:number, buyerId: number, userAddress:string): Result<string> {
        if(!this.buyingPolicy.hasBuyingOption(buyingOption.INSTANT)){
            return makeFailure("Store does not support instant buying option")
        }
        let sellResult = this.inventory.reserveProduct(productId, quantity);
        if(isFailure(sellResult)){
            return sellResult;
        }
        let productMap = new Map <number, number>();
        productMap.set(productId, quantity);
        let fixedPrice = this.discountPolicy.applyDiscountPolicy(productMap);

        Purchase.checkout(this, fixedPrice, buyerId, productMap, userAddress);
        return makeOk("Checkout passed to purchase");
    }

    private buyOffer(): Result<string> {
        return makeFailure("Not implemented")
    }

    private buyBid(): Result<string> {
        return makeFailure("Not implemented")
    }

    private buyRaffle(): Result<string> {
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
        return this.inventory.returnReservedProduct(productId, quantity);
    }

    public searchByName(productName:string): StoreProductInfo[]{
        return this.inventory.getProductInfoByName(productName);
    }

    public searchByPriceRange(from: number, to: number): StoreProductInfo[]{
        return this.inventory.getProductInfoByPriceRange(from, to);
    }
}