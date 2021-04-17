import { DiscountPolicy } from "./DiscountPolicy";
import { BuyingPolicy } from "./BuyingPolicy";
import { Inventory } from "./Inventory";
import {Category, ID, Rating} from './Common'
import { Appointment, JobTitle } from "../user/Appointment";
import { isFailure, isOk, makeFailure, makeOk, Result } from "../../Result";
import { StoreDB } from "./StoreDB";
import { StoreInfo, StoreProductInfo } from "./StoreInfo";
import { Logger } from "../Logger";
import { buyingOption, BuyingOption } from "./BuyingOption";
import { ShoppingBasket } from "../user/ShoppingBasket";
import { Authentication } from "../user/Authentication";
import Transaction from "../purchase/Transaction";
import Purchase from "../purchase/Purchase";
import { DiscountOption } from "./DiscountOption";
import { Subscriber } from "../user/Subscriber";
import { ACTION, Permission } from "../user/Permission";


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

    public isProductAvailable(productId: number, quantity: number): boolean {
        if(this.storeClosed){
            return false
        }
        return this.inventory.isProductAvailable(productId, quantity);
    }

    public addNewProduct(subscriber: Subscriber, productName: string, categories: number[], price: number, quantity = 0): Result<string> {
        if(this.storeClosed){
            return makeFailure("Store is closed")
        }
        if(!subscriber.checkIfPerrmited(ACTION.INVENTORY_EDITTION, this)){
            return makeFailure("User not permitted")
        }
        for(let category of categories){
            if(!Object.values(Category).includes(category)){
                Logger.log(`Got invalid category number: ${category}`)
                return makeFailure("Got invalid category")
            }
        }

        return this.inventory.addNewProduct(productName, categories, this.storeId, price, quantity);
    }

    public setProductQuantity(subscriber: Subscriber, productId: number, quantity: number): Result<string> {
        if(this.storeClosed){
            return makeFailure("Store is closed")
        }
        if(!subscriber.checkIfPerrmited(ACTION.INVENTORY_EDITTION, this)){
            return makeFailure("User not permitted")
        }

        return this.inventory.setProductQuantity(productId, quantity);
    }

    public sellShoppingBasket(buyerId: number, userAddress: string, shoppingBasket: ShoppingBasket): Result<boolean> {
        if(this.storeClosed){
            return makeFailure("Store is closed")
        }
        let productList = shoppingBasket.getProducts();
        let reservedProducts = new Map <number, number> ();
        let pricesToQuantity = new Map <number, number> ();
        for (let [id, quantity] of productList) {
            let sellResult = this.inventory.reserveProduct(id, quantity);
            let productPrice = this.inventory.getProductPrice(id);
            if(isOk(sellResult) && sellResult.value && productPrice != -1){
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
        Logger.log("Checkout passed to purchase")
        return makeOk(true);
    }


    public cancelReservedShoppingBasket(buyerId: number, productId: number, quantity: number): Result<string> {
        return makeFailure("Not implemented");
    }

    private buyingOptionsMenu = [this.buyInstant, this.buyOffer, this.buyBid, this.buyRaffle];

    public sellProduct(buyerId: number,userAddr: string, productId: number, quantity: number, buyingOption: buyingOption): Result<string> {
        if(this.storeClosed){
            return makeFailure("Store is closed")
        }
        if(buyingOption < this.buyingOptionsMenu.length && buyingOption >= 0){
            return this.buyingOptionsMenu[buyingOption](productId, quantity, buyerId, userAddr);
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

    private buyOffer(productId:number, quantity:number, buyerId: number, userAddress:string): Result<string> {
        return makeFailure("Not implemented")
    }

    private buyBid(productId:number, quantity:number, buyerId: number, userAddress:string): Result<string> {
        return makeFailure("Not implemented")
    }

    private buyRaffle(productId:number, quantity:number, buyerId: number, userAddress:string): Result<string> {
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

    public searchByName(productName:string): StoreProductInfo[]{
        return this.inventory.getProductInfoByName(productName);
    }

    public searchByCategory(category: Category): StoreProductInfo[]{
        return this.inventory.getProductInfoByCategory(category);
    }

    public deleteManager(subscriber: Subscriber, managerToDelete: number): Result<string> {
        if(subscriber.checkIfPerrmited(ACTION.MANAGER_DELETION, this))
        {
            let appointment: Appointment = this.findAppointedBy(subscriber.getUserId(), managerToDelete);
            if(appointment !== undefined)
            {
                Appointment.removeAppointment(appointment);
            }
            else
            {
                return makeFailure("subscriber can't delete a manager he didn't appoint");
            }
        }
        return makeFailure("user is not permited to delete in this store");
    }

    public permittedToViewHistory(subscriber: Subscriber): boolean {
        return subscriber.checkIfPerrmited(ACTION.VIEW_STORE_HISTORY, this)
    }

    public findAppointedBy(appointer: number, appointee: number): Appointment {
        return this.appointments.find(appointment =>
            appointment.getAppointee().getUserId() === appointee &&
            appointment.getAppointer().getUserId() === appointer)
    }

    public appointStoreOwner(appointer: Subscriber, appointee: Subscriber): Result<string>
    {
        if(appointer.checkIfPerrmited(ACTION.APPOINT_OWNER, this))
        {
            Appointment.appoint_owner(appointer, this, appointee);
        }
        return makeFailure("user is not permited to appoint store owner");

    }

    public appointStoreManager(appointer: Subscriber, appointee: Subscriber): Result<string>
    {
        if(appointer.checkIfPerrmited(ACTION.APPOINT_MANAGER, this))
        {
            Appointment.appoint_manager(appointer, this, appointee)
        }
        return makeFailure("user is not permited to appoint store manager");
    }



}