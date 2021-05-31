import DiscountPolicy from "../discount/DiscountPolicy";
import BuyingPolicy, { Rule } from "../policy/buying/BuyingPolicy";
import { Inventory } from "./Inventory";
import { TreeRoot, ID, Rating, TreeNode } from './Common'
import { Appointment } from "../user/Appointment";
import { isFailure, isOk, makeFailure, makeOk, Result } from "../../Result";
import { StoreInfo, StoreProductInfo } from "./StoreInfo";
import { buyingOption } from "./BuyingOption";
import { ShoppingBasket } from "../user/ShoppingBasket";
import { Authentication } from "../user/Authentication";
import Purchase from "../purchase/Purchase";
import { discountOption, DiscountOption } from "./DiscountOption";
import { Subscriber } from "../user/Subscriber";
import { ACTION } from "../user/Permission";
import { StoreHistory } from "./StoreHistory";
import Transaction from "../purchase/Transaction";
import { MakeAppointment } from "../user/MakeAppointment";
import { Logger } from "../../Logger";
import PaymentInfo from "../purchase/PaymentInfo";
import ShippingInfo from "../purchase/ShippingInfo";
import { tPredicate } from "../discount/logic/Predicate";
import { tDiscount } from "../discount/Discount";
import BuyingSubject from "../policy/buying/BuyingSubject";
import iCategorizer from "../discount/Categorizer";

import { StoreProduct } from "./StoreProduct";
import UniversalPolicy from "../policy/buying/UniversalPolicy";
import { productDB, storeDB } from "../../DataAccessLayer/DBinit";


export class Store implements iCategorizer
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
    private discounts: DiscountOption[];
    private buyingOptions: buyingOption[];
    private storeHistory: StoreHistory;
    private categiries: TreeRoot<string>;

    public constructor(storeId: number,
        storeFounderId: number,
        storeName: string,
        bankAccount:number,
        storeAddress: string,
        appointments: Appointment[] = [],
        storeClosed: boolean = false,
        discountPolicy: DiscountPolicy = undefined,
        buyingPolicy: BuyingPolicy = undefined)
    {

        this.storeId = storeId;
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
        this.inventory = new Inventory(storeId);
        this.messages = new Map<number, string>()
        this.storeRating = 0 // getting storeRating with numOfRaters = 0 will return NaN
        this.numOfRaters = 0
        this.bankAccount = bankAccount;
        this.storeAddress = storeAddress;
        this.storeClosed = storeClosed;
        this.appointments = appointments;
        this.discounts = [];
        this.buyingOptions = [buyingOption.INSTANT];
        this.storeHistory = new StoreHistory(this.storeId);
        this.categiries = new TreeRoot<string>('root category');
    }

    public static rebuildStore(storeId: number, storeFounderId: number,storeName: string, bankAccount:number, storeAddress: string, appointments: Appointment[], storeClosed: boolean
        ,buyingPolicy: BuyingPolicy, discountPolicy: DiscountPolicy, categiries: TreeRoot<string>): Store{
        let store = new Store(
            storeId,
            storeFounderId,
            storeName,
            bankAccount,
            storeAddress,
            appointments=appointments,
            storeClosed=storeClosed,
            discountPolicy=discountPolicy,
            buyingPolicy=buyingPolicy)
            store.categiries = categiries

        return store;
    }


    public static createStore(storeFounderId: number,storeName: string, bankAccount:number, storeAddress: string): Promise<Store> {
        let store = new Store(1,
            storeFounderId,
            storeName,
            bankAccount,
            storeAddress)

        return new Promise( (resolve,reject) => { storeDB.addStore(store).then((id: number) => {
            store.setId(id);
            resolve(store);
        }).catch((error => reject(error)))
       })
    }

    private setId(id: number){
        this.storeId = id;
    }


    public getProducts = (categoryName: string): Promise<number[]> => {
        const category:TreeNode<string> = this.categiries.getChildNode(categoryName);
        if(!category){
            return Promise.resolve([]);
        }
        const productsp: Promise<StoreProductInfo[]> = this.inventory.getProductInfoByFilter((prod:StoreProduct) => {     
            for(var i=0; i<prod.getCategories().length; i++){
                const cat = prod.getCategories()[i];
                if(category.value===cat || category.hasChildNode(cat)){
                    return true;
                }
            }
            return false;
        });
        return new Promise((resolve, reject) => {
            productsp.then(products => {
                const prodIds:number[] = products.map((prod:StoreProductInfo) => prod.getProductId());
                resolve(prodIds);
            })
        })

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

    public getDiscountPolicy()
    {
        return this.discountPolicy;
    }

    public setDiscountPolicy(discountPolicy: DiscountPolicy)
    {
        this.discountPolicy = discountPolicy;
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

    public getPurchaseHistory() : Promise<Transaction[]>{
        return this.storeHistory.getPurchaseHistory();
    }

    public isProductAvailable(productId: number, quantity: number): Promise<boolean> {
        if(this.storeClosed){
            return Promise.resolve(false)
        }
        return this.inventory.isProductAvailable(productId, quantity);
    }

    public addNewProduct(subscriber: Subscriber, productName: string, categories: string[], price: number, quantity = 0): Promise<number> {
        if(this.storeClosed){
            return Promise.reject("Store is closed")
        }
        if(!subscriber.checkIfPerrmited(ACTION.INVENTORY_EDITTION, this) && subscriber.getUserId() !== this.storeFounderId){
            return Promise.reject("User not permitted1")
        }
        for(let category of categories){
            if(!this.categiries.hasChildNode(category)){
                return Promise.reject("Got invalid category")
            }
        }

        return this.inventory.addNewProduct(productName, categories, this.storeId, price, quantity);
    }

    public setProductQuantity(subscriber: Subscriber, productId: number, quantity: number): Promise<string> {
        if(this.storeClosed){
            return Promise.reject("Store is closed")
        }
        if(!subscriber.checkIfPerrmited(ACTION.INVENTORY_EDITTION, this)){
            return Promise.reject("User not permitted2")
        }

        return this.inventory.setProductQuantity(productId, quantity);
    }

    public addBuyingPolicy(subscriber: Subscriber, policyName: string, policy: tPredicate): Promise<string> {
        if(this.storeClosed) return Promise.reject("Store is closed");
        const userId: number = subscriber.getUserId();
        if(!this.isManager(userId) && !this.isOwner(userId)) return Promise.reject("User not permitted")       
        return this.buyingPolicy.addPolicy(policy, policyName);        
    }

    public removeBuyingPolicy(subscriber: Subscriber, policyNumber: number): Promise<string> {
        if(this.storeClosed) 
            return Promise.reject("Store is closed");
        const userId: number = subscriber.getUserId();
        if(!this.isManager(userId) && !this.isOwner(userId)) 
            return Promise.reject("User not permitted3")       
        return this.buyingPolicy.removePolicy(policyNumber); 
    }

    public getBuyingPolicies(subscriber: Subscriber): Result<Rule[]> {
        if(this.storeClosed) return makeFailure("Store is closed");
        const userId: number = subscriber.getUserId();
        if(!this.isManager(userId) && !this.isOwner(userId)) return makeFailure("User not permitted4")       
        return makeOk(this.buyingPolicy.getPolicies()); 
    }

    public async sellShoppingBasket(buyerId: number, userAddress: string, shoppingBasket: ShoppingBasket, buyingSubject:BuyingSubject , onFail : ()=>void): Promise<boolean> {
        if(this.storeClosed){
            return Promise.reject("Store is closed")
        }
        const policyRes = this.buyingPolicy.isSatisfied(buyingSubject);//TODO: FIX
        if(isFailure(policyRes))return Promise.reject(policyRes.message);
        if(policyRes.value !== BuyingPolicy.SUCCESS) return Promise.reject(policyRes.value);

        const policyRes2 = UniversalPolicy.isSatisfied(buyingSubject);
        if(isFailure(policyRes2))return Promise.reject(policyRes2.message);
        else if(policyRes2.value !== BuyingPolicy.SUCCESS) return Promise.reject(policyRes2.value);

        let productList = shoppingBasket.getProducts();
        let reservedProducts = new Map <number, [number,string,number]> (); // id => [quantity, name, price]
        var price: number = 0;
        for (let [id, quantity] of productList) {
            //TODO:!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            let product = await productDB.getProductById(id);
            let sellResult =  this.inventory.reserveProduct(id, quantity);
            let productPrice = product.getPrice()
            let pname = product.getName();
            price += (productPrice * quantity);
            if(sellResult && productPrice != -1){
                reservedProducts.set(id,[quantity,pname,price]);
            }
            else{
                this.cancelReservedShoppingBasket(reservedProducts)
                return Promise.reject(sellResult);
            }
        }
        
        const discountRes = this.discountPolicy.getDiscount(buyingSubject.getBasket(),this);
        if(isFailure(discountRes)) return Promise.reject(discountRes.message);
        price -= discountRes.value;
        Purchase.checkout(this.storeId, price, buyerId, reservedProducts, this.storeName,() => {
            onFail();
            this.cancelReservedShoppingBasket(reservedProducts)}
         );
        return Promise.resolve(true);
    }


    public cancelReservedShoppingBasket(reservedProducts: Map <number, [number,string,number]>) {
        return () => {
            if(reservedProducts !== undefined){
                for (let [id, [quantity,name,price]] of reservedProducts.entries()) {
                    this.inventory.returnReservedProduct(id, quantity);
                }
            }
        }
    }

    private buyingOptionsMenu = [this.buyInstant, this.buyOffer, this.buyBid, this.buyRaffle];

    public sellProduct(buyerId: number,userAddr: string, productId: number, quantity: number, buyingOption: buyingOption): Promise<string> {
        if(this.storeClosed){
            return Promise.reject("Store is closed")
        }
        if(buyingOption < this.buyingOptionsMenu.length && buyingOption >= 0){
            //return this.buyingOptionsMenu[buyingOption](productId, quantity, buyerId, userAddr);
            return this.buyInstant(productId,quantity,buyerId,userAddr);
        }
        return Promise.reject("Invalid buying option");
    }

    private buyInstant(productId:number, quantity:number, buyerId: number, userAddress:string): Promise<string> {
        // if(!this.hasBuyingOption(buyingOption.INSTANT)){
        //     return Promise.reject("Store does not support instant buying option")
        // }
        // let sellResult = this.inventory.reserveProduct(productId, quantity);
        // if(isFailure(sellResult)){
        //     return Promise.reject(sellResult.message);
        // }
        // let productMap = new Map <number, number>(); // map price to quantity
        // let productPrice = this.inventory.getProductPrice(productId)
        // if(productPrice === -1){
        //     return Promise.reject("Product was not found")
        // }
        // productMap.set(productPrice, quantity);
        // let fixedPrice = this.applyDiscountPolicy(productMap);

        // Purchase.checkout(this.storeId, fixedPrice, buyerId, productMap, this.storeName, this.cancelReservedShoppingBasket(productMap));
        return Promise.resolve("Checkout passed to purchase");
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

    public closeStore(userId: number): Promise<string> {

        // this is irreversible
        let isSystemManagerp = Authentication.isSystemManager(userId)

        return new Promise((resolve,reject) => {
            isSystemManagerp.then( isSystemManager => {
                if( this.isOwner(userId) && !isSystemManager){
                    reject("User not permitted5")
                }
                else{
                    this.storeClosed = true
                    let deletestorep = storeDB.deleteStore(this.storeId)
                    deletestorep.then( _ =>{
                        resolve("store deleted")
                    })
                }
            })
        })   
    }

    public getAppointmentById(userId: number): Appointment
    {
        return this.appointments.find( appointment => appointment.appointee === userId);
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

    public getStoreInfoResult(userId: number): Promise<string> {
        let ismanagerp = Authentication.isSystemManager(userId);
        return new Promise((resolve, reject) =>{
            ismanagerp.then( ismanager => {
                if(!this.isOwner(userId) && !ismanager)
                    reject("User not permitted6")
                resolve(JSON.stringify(this.getStoreInfo()))
            })
            .catch( error => reject(error))
        })
    }

    public getStoreInfo(): Promise<StoreInfo> {
        return new Promise((resolve,reject) => {
            let products_infop = this.inventory.getProductsInfo()
            products_infop.then( products_info => {
                resolve(new StoreInfo(this.getStoreName(), this.getStoreId(),products_info , this.categiries))
            })
        })
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

    public searchByName(productName:string): Promise<StoreProductInfo>{
        return this.inventory.getProductInfoByName(productName);
    }

    public getProductsInfo(): Promise<StoreProductInfo[]> {
        return this.inventory.getProductInfoByFilter((_) => true);
    }

    public searchByCategory(category: string): Promise<StoreProductInfo[]>{
        if(!this.categiries.hasChildNode(category)){
            Logger.log(`No category: ${category} in store: ${this.storeName}`);
            return Promise.resolve([]);
        }
        return this.inventory.getProductInfoByCategory(category);
    }

    public searchBelowPrice(price: number): Promise<StoreProductInfo[]> {
        return this.inventory.getProductInfoByFilter((storeProduct) => storeProduct.getPrice() > price);
    }

    public searchAbovePrice(price: number): Promise<StoreProductInfo[]> {
        return this.inventory.getProductInfoByFilter((storeProduct) => storeProduct.getPrice() < price);
    }

    public searchAboveRating(rating: number): Promise<StoreProductInfo[]> {
        return this.inventory.getProductInfoByFilter((storeProduct) => storeProduct.getProductRating() < rating);
    }

    public deleteManager(subscriber: Subscriber, managerToDelete: number): Promise<string> {
        let appointment: Appointment = this.findAppointedBy(subscriber.getUserId(), managerToDelete);
        if(appointment !== undefined)
        {
            return MakeAppointment.removeAppointment(appointment);
        }
        else
        {
            return Promise.reject("subscriber can't delete a manager he didn't appoint");
        }
    }

    public permittedToViewHistory(subscriber: Subscriber): boolean {
        return subscriber.checkIfPerrmited(ACTION.VIEW_STORE_HISTORY, this)
    }

    public findAppointedBy(appointer: number, appointee: number): Appointment {
        return this.appointments.find(appointment =>
            appointment.getAppointeeId() === appointee &&
            appointment.getAppointerId() === appointer)
    }

    public appointStoreOwner(appointer: Subscriber, appointee: Subscriber): Promise<string>
    {
        let ismanagerp = Authentication.isSystemManager(appointer.getUserId())
        return new Promise( (resolve,reject) => {
            ismanagerp.then( ismanager => {
                if(appointer.checkIfPerrmited(ACTION.APPOINT_OWNER, this) || ismanager)
                {
                    let makeapp = MakeAppointment.appoint_owner(appointer, this, appointee);
                    makeapp.then( msg => {
                        resolve(msg)
                    })
                    .catch( error => {
                        reject(error)
                    })
                }
                else reject("user is not permited to appoint store owner")
            })
        })
    }

    public appointStoreManager(appointer: Subscriber, appointee: Subscriber): Promise<string>
    {
        let ismanagerp =Authentication.isSystemManager(appointer.getUserId())
        return new Promise ((resolve,reject) => {
            ismanagerp.then( ismanager => {
                if(appointer.checkIfPerrmited(ACTION.APPOINT_MANAGER, this) || ismanager || appointer.getUserId() === this.storeFounderId)
                {
                    let makeapp = MakeAppointment.appoint_manager(appointer, this, appointee)
                    makeapp.then( msg => {
                        resolve(msg)
                    })
                    .catch( error => {
                        reject(error)
                    })
                }
                else reject("user is not permited to appoint store manager");
            })
        })
    }

    public editStaffPermission(subscriber: Subscriber, managerToEditId: number, permissionMask: number): Promise<string> {

        let appointment: Appointment = this.findAppointedBy(subscriber.getUserId(), managerToEditId);
        if(appointment !== undefined)
        {
            return appointment.editPermissions(permissionMask);
        }
        return Promise.reject("subscriber can't edit a manager he didn't appoint");
    }

    public getStoreStaff(subscriber: Subscriber): Promise<string> {
        if(!subscriber.checkIfPerrmited(ACTION.VIEW_STORE_STAFF, this)){
            return Promise.reject('subscriber cant view store staff')
        }
        var staff : any = {}
        staff['subscribers']=[]
        this.appointments.forEach((appointment) => {
            let subscriberId = appointment.getAppointeeId()
            staff['subscribers'].push(
            {   'id':subscriber.getUserId() ,
                'username': subscriber.getUsername(),
                'permission': subscriber.getPermission(this.storeId),
                'title': this.isOwner(subscriber.getUserId()) ? "Owner" : "Manager",
            }
                                        )
        })
        return Promise.resolve(JSON.stringify(staff))
    }

    public addDiscount(subscriber: Subscriber, name: string, discount: tDiscount): Promise<string> {
        if(this.storeClosed) return Promise.reject("Store is closed");
        const userId: number = subscriber.getUserId();
        if(!this.isManager(userId) && !this.isOwner(userId)) return Promise.reject("User not permitted7");
        return this.discountPolicy.addPolicy(discount);
    }

    public removeDiscountPolicy(subscriber: Subscriber, policyNumber: number): Promise<string> {
        if(this.storeClosed) return Promise.reject("Store is closed");
        const userId: number = subscriber.getUserId();
        if(!this.isManager(userId) && !this.isOwner(userId)) return Promise.reject("User not permitted8")       
        return this.discountPolicy.removePolicy(policyNumber); 
    }

    public addDiscount3(discount: DiscountOption)
    {
        this.discounts.push(discount)
    }

    public deleteDiscount(discountId: number)
    {
        this.discounts = this.discounts.filter(discount => discount.getId() !== discountId);
    }

    public applyDiscountPolicy(productMap: Map<number, number>) : number{
        let totalPrice = 0
        let activeDiscountPercents = []
        let now = new Date();
        now.setHours(0,0,0,0);
        for(let discount of this.discounts){
            if(discount.getDateFrom() <= now && discount.getDateUntil() >= now){
                //TODO: check for conditional discount predicats
                activeDiscountPercents.push(discount.getPercent())
            }
        }
        for(let [productPrice, quantity] of productMap){
            let discountPrice = productPrice
            for(let discount of activeDiscountPercents){
                discountPrice *= ((100 - discount)/100)
            }
            totalPrice += discountPrice*quantity
        }
        return totalPrice
    }

    public hasBuyingOption(option: buyingOption) {
        return this.buyingOptions.some( buyingOption => buyingOption === option )
    }

    public addBuyingOption(buyingOption: buyingOption)
    {
        // This overiddes the current if exists
        this.deleteBuyingOption(buyingOption)
        this.buyingOptions.push(buyingOption)
    }

    public deleteBuyingOption( buyingOption: buyingOption)
    {
        this.buyingOptions = this.buyingOptions.filter(option => option !== buyingOption);
    }

    public completeOrder(userId : number , paymentInfo : PaymentInfo, userAddress: string) : Promise<boolean>
    {
        return Purchase.CompleteOrder(userId,
            this.storeId,
            new ShippingInfo(this.storeAddress, userAddress),
            paymentInfo,
            this.bankAccount);
    }

    public addCategory(categoryFather: string, category: string): Promise<string>{
        if(this.categiries.hasChildNode(category)){
            return Promise.reject(`Category: ${category} already exists in store: ${this.storeName}`)
        }

        if(!this.categiries.hasChildNode(categoryFather)){
            return Promise.reject(`Category Father: ${categoryFather} does not exists in store: ${this.storeName}`)
        }

        let fatherNode = this.categiries.getChildNode(categoryFather)
        
        //TODO: #saveDB
        fatherNode.createChildNode(category)
        
        return Promise.resolve('category was added')
    }

    public addCategoryToRoot(category: string): Promise<string>{
        if(this.categiries.hasChildNode(category)){
            return Promise.reject(`Category: ${category} already exists in store: ${this.storeName}`)
        }

        //TODO: how to save category in db? #saveDB
        this.categiries.createChildNode(category);
        return Promise.resolve('category was added')
    }

    public getProductQuantity(productId : number) : Promise<number>{
        return productDB.getProductQuantity(productId);
    }

    public getProductbyId( productId : number) : Promise<StoreProduct>{
        return this.inventory.getProductById(productId)
    }

    public getIsStoreClosed(){
        return this.storeClosed;
    }

}