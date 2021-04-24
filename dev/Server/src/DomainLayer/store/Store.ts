import { DiscountPolicy } from "./DiscountPolicy";
import { BuyingPolicy } from "./BuyingPolicy";
import { Inventory } from "./Inventory";
import {Category, ID, Rating} from './Common'
import { Appointment } from "../user/Appointment";
import { isFailure, isOk, makeFailure, makeOk, Result } from "../../Result";
import { StoreDB } from "./StoreDB";
import { StoreInfo, StoreProductInfo } from "./StoreInfo";
import { Logger } from "../../Logger";
import { buyingOption, BuyingOption } from "./BuyingOption";
import { ShoppingBasket } from "../user/ShoppingBasket";
import { Authentication } from "../user/Authentication";
import Purchase from "../purchase/Purchase";
import { DiscountOption } from "./DiscountOption";
import { Subscriber } from "../user/Subscriber";
import { ACTION } from "../user/Permission";
import { MakeAppointment } from "../user/MakeAppointment";


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

    public constructor(storeFounderId: number,storeName: string, bankAccount:number, storeAddress: string, discountPolicy: DiscountPolicy = undefined, buyingPolicy: BuyingPolicy = undefined)
    {
        this.storeId = ID();
        this.storeName = storeName;
        this.storeFounderId = storeFounderId;
        if (discountPolicy === undefined){
            this.discountPolicy = new DiscountPolicy();
        } else {
            this.discountPolicy = discountPolicy
        }
        if (buyingPolicy === undefined){
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
    public getBankAccount = () => this.bankAccount;
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
            Logger.log(`Got invalid rating ${rating}`)
            return makeFailure("Got invalid rating")
        }
        this.storeRating *= this.numOfRaters
        this.numOfRaters++
        this.storeRating += rating
        this.storeRating /= this.numOfRaters
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

    public addNewProduct(subscriber: Subscriber, productName: string, categories: number[], price: number, quantity = 0): Result<number> {
        if(this.storeClosed){
            return makeFailure("Store is closed")
        }
        if(!subscriber.checkIfPerrmited(ACTION.INVENTORY_EDITTION, this) && !Authentication.isSystemManager(subscriber.getUserId())
            && subscriber.getUserId() !== this.storeFounderId){
            return makeFailure("User not permitted")
        }
        for(let category of categories){
            if(!Object.values(Category).includes(category)){
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
                this.cancelReservedShoppingBasket(reservedProducts)
                return sellResult;
            }
        }
        let fixedPrice = this.discountPolicy.applyDiscountPolicy(pricesToQuantity);

        Purchase.checkout(this, fixedPrice, buyerId, reservedProducts, userAddress);
        return makeOk(true);
    }


    public cancelReservedShoppingBasket(reservedProducts: Map <number, number>) {
        if(reservedProducts !== undefined){
            for (let [id, quantity] of reservedProducts.entries()) {
                this.inventory.returnReservedProduct(id, quantity);
            }
        }
    }

    private buyingOptionsMenu = [this.buyInstant, this.buyOffer, this.buyBid, this.buyRaffle];

    public sellProduct(buyerId: number,userAddr: string, productId: number, quantity: number, buyingOption: buyingOption): Result<string> {
        if(this.storeClosed){
            return makeFailure("Store is closed")
        }
        if(buyingOption < this.buyingOptionsMenu.length && buyingOption >= 0){
            //return this.buyingOptionsMenu[buyingOption](productId, quantity, buyerId, userAddr);
            return this.buyInstant(productId,quantity,buyerId,userAddr);
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
        if( this.isOwner(userId) && !Authentication.isSystemManager(userId)){
            return makeFailure("User not permitted")
        }
        this.storeClosed = true
        StoreDB.deleteStore(this.storeId)
    }

    public getAppointmentById(userId: number): Appointment
    {
        return this.appointments.find( appointment => appointment.appointee.getUserId() === userId);
    }

    public isOwner(userId: number): boolean
    {
        let app: Appointment = this.getAppointmentById(userId);
        if (app != undefined)
            return app.isOwner();
        return false;
    }

    public isManager(userId: number): boolean
    {
        let app: Appointment = this.getAppointmentById(userId);
        if( app !== undefined)
            return app.isManager();
        return false;
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

    public getStoreInfoResult(userId: number): Result<string> {
        if(!this.isOwner(userId) && !Authentication.isSystemManager(userId)){
            return makeFailure("User not permitted")
        }
        return makeOk(JSON.stringify(this.getStoreInfo()))
    }

    public getStoreInfo(): StoreInfo {
        return (new StoreInfo(this.getStoreName(), this.getStoreId(), this.inventory.getProductsInfo()))
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

    public searchByName(productName:string): StoreProductInfo[]{
        return this.inventory.getProductInfoByName(productName);
    }

    public searchByCategory(category: Category): StoreProductInfo[]{
        return this.inventory.getProductInfoByCategory(category);
    }

    public searchBelowPrice(price: number): StoreProductInfo[]{
        return this.inventory.getProductInfoByFilter((storeProduct) => storeProduct.getPrice() > price);
    }

    public searchAbovePrice(price: number): StoreProductInfo[]{
        return this.inventory.getProductInfoByFilter((storeProduct) => storeProduct.getPrice() < price);
    }

    public searchAboveRating(rating: number): StoreProductInfo[]{
        return this.inventory.getProductInfoByFilter((storeProduct) => storeProduct.getProductRating() < rating);
    }

    public deleteManager(subscriber: Subscriber, managerToDelete: number): Result<string> {
        let appointment: Appointment = this.findAppointedBy(subscriber.getUserId(), managerToDelete);
        if(appointment !== undefined)
        {
            return MakeAppointment.removeAppointment(appointment);
        }
        else
        {
            return makeFailure("subscriber can't delete a manager he didn't appoint");
        }
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
        if(appointer.checkIfPerrmited(ACTION.APPOINT_OWNER, this) || Authentication.isSystemManager(appointer.getUserId())
            || appointer.getUserId() === this.storeFounderId)
        {
            return MakeAppointment.appoint_owner(appointer, this, appointee);
        }
        return makeFailure("user is not permited to appoint store owner");

    }

    public appointStoreManager(appointer: Subscriber, appointee: Subscriber): Result<string>
    {
        if(appointer.checkIfPerrmited(ACTION.APPOINT_MANAGER, this) || Authentication.isSystemManager(appointer.getUserId())
            || appointer.getUserId() === this.storeFounderId)
        {
            return MakeAppointment.appoint_manager(appointer, this, appointee)
        }
        return makeFailure("user is not permited to appoint store manager");
    }

    public editStaffPermission(subscriber: Subscriber, managerToEditId: number, permissionMask: number): Result<string> {

        let appointment: Appointment = this.findAppointedBy(subscriber.getUserId(), managerToEditId);
        if(appointment !== undefined)
        {
            return appointment.editPermissions(permissionMask);
        }
        return makeFailure("subscriber can't edit a manager he didn't appoint");
    }

    public getStoreStaff(subscriber: Subscriber): Result<string> {
        if(!subscriber.checkIfPerrmited(ACTION.VIEW_STORE_STAFF, this)){
            return makeFailure('subscriber cant view store staff')
        }
        var staff : any = {}
        staff['subscribers']=[]
        this.appointments.forEach((appointment) => {
            let subscriber = appointment.getAppointee()
            staff['subscribers'].push({ 'id':subscriber.getUserId() ,
                                        'title': this.isOwner(subscriber.getUserId()) ? "Owner" : "Manager",
                                        })
        })
        return makeOk(JSON.stringify(staff))
    }

}