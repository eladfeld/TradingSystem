import { DiscountPolicy } from "./DiscountPolicy";
import { BuyingPolicy } from "./BuyingPolicy";
import { Inventory } from "./Inventory";
import {Category, ID, Rating} from './Common'
import { Appointment, JobTitle } from "../user/Appointment";
import { isFailure, isOk, makeFailure, makeOk, Result } from "../../Result";
import { StoreHistory } from "./StoreHistory";
import { StoreDB } from "./StoreDB";
import { StoreInfo, StoreProductInfo } from "./StoreInfo";
import { Logger } from "../Logger";
import { buyingOption, BuyingOption } from "./BuyingOption";
import { ShoppingBasket } from "../user/ShoppingBasket";
import { Authentication } from "../user/Authentication";
import Transaction from "../purchase/Transaction";
import Purchase from "../purchase/Purchase";
import { DiscountOption } from "./DiscountOption";


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
    private storeClosed: boolean
    private appointments: Appointment[]

    public constructor(storeFounderId: number,storeName: string, bankAccount:number, storeAddress: string, discountPolicy: DiscountPolicy = null, buyingPolicy: BuyingPolicy = null)
    {
        this.storeId = ID();
        this.storeName = storeName;
        this.storeFounderId = storeFounderId;
        if (discountPolicy === null){
            this.discountPolicy = new DiscountPolicy();
        } else {
            this.discountPolicy = discountPolicy
        }
        if (buyingPolicy === null){
            this.buyingPolicy = new BuyingPolicy();
        } else {
            this.buyingPolicy = buyingPolicy
        }
        this.inventory = new Inventory();
        this.messages = new Map<number, string>()
        this.storeHistory = new StoreHistory(this.storeId, this.storeName, Date.now())
        this.storeRating = 0 // getting storeRating with numOfRaters = 0 will return NaN
        this.numOfRaters = 0
        this.bankAccount = bankAccount;
        this.storeAddress = storeAddress;
        this.storeClosed = false
        this.appointments = []

        StoreDB.addStore(this);
    }

    public getStoreAddress = () => this.storeAddress;
    public getStoreId()
    {
        return this.storeId;
    }

    public getStoreName()
    {
        return this.storeName;
    }

    public getBuyingPolicy()
    {
        return this.buyingPolicy;
    }

    public setBuyingPolicy(buyingPolicy: BuyingPolicy)
    {
        this.buyingPolicy = buyingPolicy;
    }

    public addBuyingOption(buyingOption: BuyingOption)
    {
        this.buyingPolicy.addBuyingOption(buyingOption);
    }

    public deleteBuyingOption(buyingOption: buyingOption)
    {
        this.buyingPolicy.deleteBuyingOption(buyingOption);
    }

    public getDiscountPolicy()
    {
        return this.discountPolicy;
    }

    public setDiscountPolicy(discountPolicy: DiscountPolicy)
    {
        this.discountPolicy = discountPolicy;
    }

    public addDiscount(discount: DiscountOption)
    {
        this.discountPolicy.addDiscount(discount);
    }

    public deleteDiscount(discountId: number)
    {
        this.discountPolicy.deleteDiscount(discountId);
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
        if(this.storeClosed){
            return makeFailure("Store is closed")
        }
        return this.inventory.isProductAvailable(productId, quantity);
    }

    public addNewProduct(productName: string, categories: Category[], price: number, quantity = 0): Result<string> {
        if(this.storeClosed){
            return makeFailure("Store is closed")
        }
        // we should check who calls this method is authorized
        return this.inventory.addNewProduct(productName, categories, this.storeId, price, quantity);
    }

    public sellShoppingBasket(buyerId: number, userAddress: string, shoppingBasket: ShoppingBasket): Result<string> {
        if(this.storeClosed){
            return makeFailure("Store is closed")
        }
        let productList = shoppingBasket.getProducts();
        let reservedProducts = new Map <number, number> ();
        let pricesToQuantity = new Map <number, number> ();
        for (let [id, quantity] of productList) {
            let sellResult = this.inventory.reserveProduct(id, quantity);
            let productPrice = this.inventory.getProductPrice(id);
            if(isOk(sellResult) && productPrice != -1){
                reservedProducts.set(id,quantity);
                pricesToQuantity.set(productPrice,quantity);
            }
            else{
                for (let [id, quantity] of reservedProducts) {
                    this.inventory.returnReservedProduct(id, quantity);
                }
                return sellResult;
            }
        }
        let fixedPrice = this.discountPolicy.applyDiscountPolicy(pricesToQuantity);

        Purchase.checkout(this, fixedPrice, buyerId, reservedProducts, userAddress);
        return makeOk("Checkout passed to purchase");
    }


    public cancelReservedShoppingBasket(buyerId: number, productId: number, quantity: number): Result<string> {
        return makeFailure("Not implemented");
    }

    public completedTransaction(transaction: Transaction) {
        this.storeHistory.saveTransaction(transaction);
    }

    public getStoreHistory(): StoreHistory {
        return this.storeHistory;
    }

    private buyingOptionsMenu = [this.buyInstant, this.buyOffer, this.buyBid, this.buyRaffle];

    public sellProduct(buyerId: number,userAddr: string, productId: number, quantity: number, buyingOption: BuyingOption): Result<string> {
        if(this.storeClosed){
            return makeFailure("Store is closed")
        }
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
        let productMap = new Map <number, number>(); // map price to quantity
        let productPrice = this.inventory.getProductPrice(productId)
        if(productPrice === -1){
            return makeFailure("Product was not found")
        }
        productMap.set(productPrice, quantity);
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

    public closeStore(userId: number): Result<string> {

        // this is irreversible
        if(this.getTitle(userId) != JobTitle.FOUNDER && !Authentication.isSystemManager(userId)){
            return makeFailure("User not permitted")
        }
        this.storeClosed = true
        StoreDB.deleteStore(this.storeId)
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
    {
        this.appointments.push(appointment);
    }

    public deleteAppointment(appointment : Appointment) : void
    {
        this.appointments = this.appointments.filter(app => app !== appointment);
    }

    public getAppointments(): Appointment[]
    {
        return this.appointments
    }

    public getTitle(userId : number) : JobTitle
    {
        let app: Appointment = this.appointments.find( appointment => {
            appointment.getAppointee().getUserId() === userId && appointment.getStore().storeId === this.storeId
        });
        if (app != undefined)
            return app.getTitle();
        return undefined;
    }

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