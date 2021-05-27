import { Logger } from "../Logger";
import { Store } from "./store/Store";
import { Appointment } from "./user/Appointment";
import { Login } from "./user/Login";
import { Register } from "./user/Register";
import { Subscriber } from "./user/Subscriber";
import { PaymentMeans, SupplyInfo, User } from "./user/User";
import { isFailure,isOk, makeFailure, makeOk, Result } from "../Result";
import fs from 'fs';
import path, { resolve } from 'path'
import { buyingOption } from "./store/BuyingOption";
import { Authentication } from "./user/Authentication";
import { StoreDB } from "./store/StoreDB";
import Purchase, { tPaymentInfo, tShippingInfo } from "./purchase/Purchase";
import Transaction from "./purchase/Transaction";
import { ProductDB } from "./store/ProductDB";
import { MakeAppointment } from "./user/MakeAppointment";
import { Publisher } from "./notifications/Publisher";
import { createHash } from 'crypto';
import { SpellChecker } from "./apis/spellchecker";
import { SpellCheckerAdapter } from "./SpellCheckerAdapter";
import { tPredicate } from "./discount/logic/Predicate";
import { tDiscount } from "./discount/Discount";
import SupplySystemReal from "./apis/SupplySystemReal";
import PaymentSystemReal from "./apis/PaymentSystemReal";

export class SystemFacade
{
    private logged_guest_users : Map<string,User>; // sessionId => User
    private logged_subscribers : Map<string,Subscriber> ; //sessionId =>subscriber
    private logged_system_managers : Map<string,Subscriber>; // sessionId=>manager
    private static lastSessionId = 0;

    public constructor()
    {
        this.logged_guest_users = new Map();
        this.logged_subscribers = new Map();
        this.logged_system_managers = new Map();
        if(!(this.initPaymentSystem() && this.initSupplySystem() &&  this.initSystemManagers()))
        {
            Logger.error("system could not initialized properly!");
        }
    }

    private async initSupplySystem() : Promise<boolean>
    {
        const initialization = await SupplySystemReal.init();
        return initialization > 0 ? true : false;
    }

    private async initPaymentSystem() : Promise<boolean>
    {
        const initialization = await PaymentSystemReal.init();
        return initialization > 0 ? true : false;
    }

    public initSystemManagers() : boolean
    {
        const data = fs.readFileSync(path.resolve('src/systemManagers.json') ,  {encoding:'utf8', flag:'r'});
        let arr: any[] = JSON.parse(data);
        if (arr.length === 0)
        {
            Logger.error("no system managers found!");
            return false;
        }
        for (var i in arr)
        {
            let manager: any = arr[i];
            let sub: Subscriber = Subscriber.buildSubscriber(manager["username"], manager["hashpassword"], manager["age"] )
            Authentication.addSystemManager(sub);
        }
        return true
    }

    //user enter the system
    public enter(): Promise<string>
    {
        Logger.log("new user entered the system");
        let user: User = new User();
        let sessionId = SystemFacade.getSessionId();
        this.logged_guest_users.set(sessionId,user);
        return new Promise( (resolve,reject) => {
            resolve(sessionId);
        })
    }

    public exit(sessionId: string): void
    {
        Logger.log(`exit : sessionId:${sessionId}`);
        this.logged_guest_users.delete(sessionId);
        this.logged_subscribers.delete(sessionId);
        this.logged_system_managers.delete(sessionId);
    }

    public logout(sessionId: string): Promise<string>
    {
        Logger.log(`logout : sessionId:${sessionId}`);
        this.exit(sessionId);
        let user: User = new User();

        //when someone logs out he is guest again
        this.logged_guest_users.set(sessionId,user);
        return new Promise( (resolve,reject) => { resolve(sessionId)});
    }

    public register(username: string, password: string, age:number): Promise<string>
    {
        if(username === '' || username === undefined || username === null){
            return new Promise((resolve,reject) => { reject("invalid username name")})
        }
        if(password === '' || password === undefined || password === null){
            return new Promise((resolve,reject) => { reject("invalid password")})
        }
        if(age < 1 || age === undefined || age === null){
            return new Promise((resolve,reject) => { reject("invalid age")})
        }
        Logger.log(`register : username:${username}`);
        let reg =Register.register(username, password, age);
        if(isOk(reg))
        {
            let subscriber = reg.value;
            return new Promise( (resolve, reject) =>{
                resolve(subscriber);
            })
        }
        if (isFailure(reg))
        {
            let message =  reg.message;
            return new Promise ( (resolve, reject) => {
                reject(message)
            })
        }
    }

    public login(sessionId: string, username: string, password: string): Promise<Subscriber>
    {
        Logger.log(`login : sessionId:${sessionId} , username:${username}`);

        if(username === '' || username === undefined || username === null)
            return new Promise((resolve,reject) => { reject("invalid username name")})
        if(password === '' || password === undefined || password === null)
            return new Promise((resolve,reject) => { reject("invalid password")})
        if(this.logged_guest_users.get(sessionId) === undefined)
        {
            Logger.log(`login => user didn't enter the system`);
            return new Promise( (resolve,reject) => {reject("user didn't enter the system")});
        }

        let res: Result<Subscriber> =  Login.login(username, password);
        if (isFailure(res))
        {
            let msg = res.message;
            Logger.log(`login => ${msg}`);
            return new Promise( (resolve,reject) => {reject(msg)});;
        }
        
        let subscriber : Subscriber = res.value;
        setTimeout( function () { 
            Publisher.get_instance().send_pending_messages(subscriber)} , 1000) // just to let wss connection to establish
        
        this.logged_guest_users.set(sessionId,subscriber)
        this.logged_subscribers.set(sessionId,subscriber);
        if(subscriber.isSystemManager())
        {
            this.logged_system_managers.set(sessionId,subscriber);
        }

        return new Promise( (resolve,reject) => {
        Logger.log(`login => logged in`);
        resolve(subscriber)});
    }

    public getStoreInfo(sessionId : string ,storeId: number): Promise<string>
    {
        Logger.log(`getStoreInfo : sessionId:${sessionId} , storeId:${storeId}`);
        if(storeId === undefined || storeId === null){
            return new Promise((resolve,reject) => { reject("invalid storeId")})
        }
        let store: Store = StoreDB.getStoreByID(storeId);
        let user = this.logged_guest_users.get(sessionId)
        if (user === undefined)
            return new Promise((resolve,reject) => reject("user is not logged in"))
        let res: Result<string> = store.getStoreInfoResult(user.getUserId());
        if(isOk(res))
        {
            let value = res.value;
            return new Promise((resolve, reject) =>
            {
                resolve(value);
            })
        }
        else
        {
            let error = res.message;
            return new Promise((resulve, reject) =>
            {
                reject(error);
            })
        }
    }

    public getPruductInfoByName(sessionId : string, productName: string): Promise<string>
    {
        Logger.log(`getPruductInfoByName : sessionId:${sessionId}, productName: ${productName}`);
        let res:Result<string> = StoreDB.getPruductInfoByName(productName);
        if(isOk(res))
        {
            let value = res.value;
            return new Promise((resolve, reject) =>
            {
                resolve(value);
            })
        }
        else
        {
            let error = res.message;
            return new Promise((resulve, reject) =>
            {
                reject(error);
            })
        }
    }

    public getPruductInfoByCategory(sessionId : string, category: string): Promise<string>
    {
        Logger.log(`getPruductInfoByCategory : sessionId:${sessionId} , category:${category}`);
        let res: Result<string> = StoreDB.getPruductInfoByCategory(category);
        if(isOk(res))
        {
            let value = res.value;
            return new Promise((resolve, reject) =>
            {
                resolve(value);
            })
        }
        else
        {
            let error = res.message;
            return new Promise((resulve, reject) =>
            {
                reject(error);
            })
        }

    }

    public getPruductInfoAbovePrice(userId : number, price: number): Promise<string>
    {
        Logger.log(`getPruductInfoAbovePrice : userId:${userId} , price:${price}`);
        let res: Result<string> = StoreDB.getProductInfoAbovePrice(price);
        if(isOk(res))
        {
            let value = res.value;
            return new Promise((resolve, reject) =>
            {
                resolve(value);
            })
        }
        else
        {
            let error = res.message;
            return new Promise((resulve, reject) =>
            {
                reject(error);
            })
        }
    }

    public getPruductInfoBelowPrice(userId : number, price: number): Promise<string>
    {
        Logger.log(`getPruductInfoBelowPrice : userId:${userId} , price:${price}`);
        let res: Result<string> = StoreDB.getProductInfoAbovePrice(price);
        if(isOk(res))
        {
            let value = res.value;
            return new Promise((resolve, reject) =>
            {
                resolve(value);
            })
        }
        else
        {
            let error = res.message;
            return new Promise((resulve, reject) =>
            {
                reject(error);
            })
        }
    }

    public getPruductInfoByStore(userId : number, store: string): Promise<string>
    {
        Logger.log(`getPruductInfoByStore : userId:${userId} , store:${store}`);
        let res: Result<string> = StoreDB.getPruductInfoByStore(store);
        if(isOk(res))
        {
            let value = res.value;
            return new Promise((resolve, reject) =>
            {
                resolve(value);
            })
        }
        else
        {
            let error = res.message;
            return new Promise((resulve, reject) =>
            {
                reject(error);
            })
        }
    }

    public addProductTocart(sessionId: string, storeId: number, productId: number, quantity: number): Promise<string>
    {
        Logger.log(`addProductTocart : sessionId:${sessionId} , storeId: ${storeId} , productId:${productId} , quantity: ${quantity}`);
        let user: User = this.logged_guest_users.get(sessionId);
        if (user !== undefined)
        {
            let res: Result<string> = user.addProductToShoppingCart(storeId, productId, quantity);
            if(isOk(res))
            {
                let value = res.value;
                return new Promise((resolve, reject) =>
                {
                    resolve(value);
                })
            }
            else
            {
                let error = res.message;
                return new Promise((resulve, reject) =>
                {
                    reject(error);
                })
            }
        }
        return new Promise((resolve, reject) => reject("user not found"));
    }

    public addCategoryToRoot(sessionId: string, storeId: number, category: string): Promise<string>
    {
        Logger.log(`addCategoryToRoot : sessionId:${sessionId} , storeId: ${storeId} , category:${category}`);
        if(category === '' || category === undefined || category === null){
            return new Promise((resolve,reject) => { reject("invalid category Name")})
        }
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let store: Store = StoreDB.getStoreByID(storeId);
        if (subscriber !== undefined)
        {
            let res: Result<string> = store.addCategoryToRoot(category)
            if(isOk(res))
            {
                SpellCheckerAdapter.get_instance().add_category(category);
                let value = res.value;
                return new Promise((resolve, reject) =>
                {
                    resolve(value);
                })
            }
            else
            {
                let error = res.message;
                return new Promise((resulve, reject) =>
                {
                    reject(error);
                })
            }
        }
        return new Promise((resolve, reject) => reject("user not found"));
    }

    public addCategory(sessionId: string, storeId: number, categoryFather:string, category: string): Promise<string>
    {
        Logger.log(`addCategory : sessionId:${sessionId} , storeId: ${storeId} , categoryFather:${categoryFather} , category:${category}`);
        if(category === '' || category === undefined || category === null){
            return new Promise((resolve,reject) => { reject("invalid category Name")})
        }
        if(categoryFather === '' || categoryFather === undefined || categoryFather === null){
            return new Promise((resolve,reject) => { reject("invalid categoryFather Name")})
        }
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let store: Store = StoreDB.getStoreByID(storeId);
        if (subscriber !== undefined)
        {
            let res: Result<string> = store.addCategory(categoryFather, category)
            if(isOk(res))
            {
                SpellCheckerAdapter.get_instance().add_category(category);
                let value = res.value;
                return new Promise((resolve, reject) =>
                {
                    resolve(value);
                })
            }
            else
            {
                let error = res.message;
                return new Promise((resulve, reject) =>
                {
                    reject(error);
                })
            }
        }
        return new Promise((resolve, reject) => reject("user not found"));
    }

    public getCartInfo(sessionId: string): Promise<string>
    {
        Logger.log(`getCartInfo : sessionId:${sessionId}`);
        let user: User = this.logged_guest_users.get(sessionId);
        if (user !== undefined)
        {
            let res: Result<string> = user.GetShoppingCart();
            if(isOk(res))
            {
                let value = res.value;
                return new Promise((resolve, reject) =>
                {
                    resolve(value);
                })
            }
            else
            {
                let error = res.message;
                return new Promise((resulve, reject) =>
                {
                    reject(error);
                })
            }
        }
        return new Promise((resolve, reject) => reject("user not found"));
    }

    public editCart(sessionId: string , storeId : number , productId : number , newQuantity : number): Promise<string>
    {
        Logger.log(`editCart : sessionId:${sessionId} , storeId:${storeId} , productId:${productId} , newQuantity:${newQuantity}`);
        if(newQuantity < 0|| newQuantity === undefined || newQuantity === null){
            return new Promise((resolve,reject) => { reject("invalid quantity")})
        }
        let user: User = this.logged_guest_users.get(sessionId);
        if (user !== undefined)
        {
            let res: Result<string> = user.editCart(storeId , productId , newQuantity);
            if(isOk(res))
            {
                let value = res.value;
                return new Promise((resolve, reject) =>
                {
                    resolve(value);
                })
            }
            else
            {
                let error = res.message;
                return new Promise((resulve, reject) =>
                {
                    reject(error);
                })
            }
        }
        return new Promise((resolve, reject) => reject("user not found"));
    }

    public checkoutBasket(sessionId: string, shopId: number, shippingInfo: tShippingInfo ): Promise<boolean>
    {
        Logger.log(`checkoutBasket : sessionId:${sessionId} , shopId:${shopId}  , supplyInfo:${shippingInfo}`);
        let user: User = this.logged_guest_users.get(sessionId);
        if (user !== undefined)
        {
            let checkout_res = user.checkoutBasket(shopId, shippingInfo);
            if (isOk(checkout_res))
            {
                let res = checkout_res.value
                return new Promise((resolve,reject)=>resolve(res))
            }
            else
            {
                let msg = checkout_res.message
                return new Promise((resolve,reject)=>reject(msg))
            }
        }
        return new Promise ((res,rej) => rej("user not found"));
    }

    public checkoutSingleProduct(sessionId : string, productId: number, quantity : number , storeId : number , shippingInfo:tShippingInfo): Promise<string>
    {
        Logger.log(`checkoutSingleProduct : sessionId : ${sessionId}, productId: ${productId}, quantity :${quantity} , storeId : ${storeId},  , supplyInfo:${shippingInfo}`);
        //supply_address = " down da block";
        if( shippingInfo === undefined || shippingInfo === null){
            return new Promise((resolve,reject) => { reject("invalid user Address")})
        }
        if(quantity < 0|| quantity === undefined || quantity === null){
            return new Promise((resolve,reject) => { reject("invalid quantity")})
        }
        let user: User = this.logged_guest_users.get(sessionId);
        if (user !== undefined)
        {
            let res: Result<string> = user.checkoutSingleProduct(productId  , quantity,  shippingInfo, storeId , buyingOption.INSTANT);
            if(isOk(res))
            {
                let value = res.value;
                return new Promise((resolve, reject) =>
                {
                    resolve(value);
                })
            }
            else
            {
                let error = res.message;
                return new Promise((resulve, reject) =>
                {
                    reject(error);
                })
            }
        }
        return new Promise((resolve, reject) => reject("user not found"));
    }

    public async completeOrder(sessionId : string , storeId : number , paymentInfo : tPaymentInfo, shippingInfo:tShippingInfo) : Promise<boolean>
    {
        Logger.log(`completeOrder: sessionId : ${sessionId}, storeId:${storeId}, paymentInfo:${paymentInfo}`);
        // if(userAddress === ''|| userAddress === undefined || userAddress === null){
        //     return new Promise((resolve,reject) => { reject("invalid user Address")})
        // }

        let user: User = this.logged_guest_users.get(sessionId);
        let store: Store = StoreDB.getStoreByID(storeId);
        if(user !== undefined)
        {
            let res: boolean = await store.completeOrder(user.getUserId(), paymentInfo, shippingInfo);
            if(res)
            {
                return new Promise((resolve, reject) =>
                {
                    resolve(res);
                })
            }
            else
            {
                return new Promise((resolve, reject) =>
                {
                    reject(res);
                })
            }
        }
        return new Promise((resolve, reject) => reject("user not found"));
    }


    public openStore(sessionId: string, storeName : string , bankAccountNumber : number ,storeAddress : string): Promise<Store>
    {
        Logger.log(`openStore : sessionId:${sessionId} , bankAccountNumber:${bankAccountNumber} , storeAddress:${storeAddress} `);

        //illegal paramters
        if(storeName === ''|| storeName === undefined || storeName === null){
            return new Promise((resolve,reject) => { reject("invalid store Name")})
        }
        if(storeAddress === ''|| storeAddress === undefined || storeAddress === null){
            return new Promise((resolve,reject) => { reject("invalid store address")})
        }
        if(bankAccountNumber < 0|| bankAccountNumber === undefined || bankAccountNumber === null){
            return new Promise((resolve,reject) => { reject("invalid bank Account Number")})
        }

        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        if(subscriber !== undefined)
        {
            if(StoreDB.getStoreByName(storeName) !== undefined || storeName === '' || storeName === undefined || storeName === null){
                return new Promise((resolve,reject) => { reject("invalid store name")})
            }
            let store: Store = new Store(subscriber.getUserId(), storeName, bankAccountNumber, storeAddress);
            MakeAppointment.appoint_founder(subscriber, store);
            Publisher.get_instance().register_store(store.getStoreId(),subscriber);
            SpellCheckerAdapter.get_instance().add_storeName(storeName);
            return new Promise( (resolve,reject) => { resolve(store)});
        }
        return  new Promise( (resolve,reject) => { reject("user not found")});
    }

    public editStoreInventory(sessionId: string, storeId: number, productId: number, quantity: number): Promise<string>
    {
        Logger.log(`editStoreInventory : sessionId:${sessionId} , storeId:${storeId}, productId:${productId}, quantity:${quantity}`);
        if(quantity < 0|| quantity === undefined || quantity === null){
            return new Promise((resolve,reject) => { reject("invalid quantity")})
        }
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let store: Store = StoreDB.getStoreByID(storeId);
        if(subscriber !== undefined && store !== undefined)
        {
            let res: Result<string> =  store.setProductQuantity(subscriber, productId, quantity);
            if(isOk(res))
            {
                let value = res.value;
                return new Promise((resolve, reject) =>
                {
                    resolve(value);
                })
            }
            else
            {
                let error = res.message;
                return new Promise((resulve, reject) =>
                {
                    reject(error);
                })
            }
        }
        return new Promise((resolve, reject) => reject("subscriber or store wasn't found"));
    }

    public addNewProduct(sessionId: string, storeId: number, productName: string, categories: string[], price: number, quantity = 0): Promise<number>
    {
        Logger.log(`addNewProduct : sessionId:${sessionId} , storeId:${storeId}, productName:${productName} , categories:${categories} , price:${price} , quantity:${quantity} `);
        if(productName === '' || productName === undefined || productName === null){
            return new Promise((resolve,reject) => { reject("invalid product Name")})
        }
        if(price < 1|| price === undefined || price === null){
            return new Promise((resolve,reject) => { reject("invalid price")})
        }
        if(quantity < 0|| quantity === undefined || quantity === null){
            return new Promise((resolve,reject) => { reject("invalid quantity")})
        }
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let store: Store = StoreDB.getStoreByID(storeId);
        if(subscriber !== undefined && store !== undefined)
        {
            let res: Result<number> = store.addNewProduct(subscriber, productName, categories, price, quantity);
            if(isOk(res))
            {
                let value = res.value;
                SpellCheckerAdapter.get_instance().add_productName(productName);
                return new Promise((resolve, reject) =>
                {
                    resolve(value);
                })
            }
            else
            {

                let error = res.message;
                Logger.log(error);
                return new Promise((resulve, reject) =>
                {
                    reject(error);
                })
            }
        }
        return new Promise((resolve, reject) => reject("subscriber or store wasn't found"));
    }

    private resultToPromise = (res: Result<any>):Promise<string> => {
        if(isOk(res))
        {
            let value = res.value;
            return new Promise((resolve, reject) =>
            {
                resolve(value);
            })
        }
        else
        {
            let error = res.message;
            return new Promise((resulve, reject) =>
            {
                reject(error);
            })
        }
    }

    public addBuyingPolicy(sessionId: string, storeId: number, policyName: string, buyingPolicy: tPredicate):Promise<string> {
        Logger.log(`addBuyingPolicy : sessionId:${sessionId} , storeId:${storeId}, policyName:${policyName}`);
        if(policyName === '' || policyName === undefined || policyName === null){
            return new Promise((resolve,reject) => { reject("invalid policy name")});
        }
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let store: Store = StoreDB.getStoreByID(storeId);
        if(subscriber !== undefined && store !== undefined)
        {
            let res: Result<string> =  store.addBuyingPolicy(subscriber, policyName, buyingPolicy);
            return this.resultToPromise(res);
        }
        return new Promise((resolve, reject) => reject("subscriber or store wasn't found"));
    }

    public removeBuyingPolicy(sessionId: string, storeId: number, policyNumber: number):Promise<string> {
        Logger.log(`removeBuyingPolicy : sessionId:${sessionId} , storeId:${storeId}, policyNumber:${policyNumber}`);
        if(policyNumber < 0){
            return new Promise((resolve,reject) => { reject("invalid policy number")});
        }
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let store: Store = StoreDB.getStoreByID(storeId);
        if(subscriber !== undefined && store !== undefined)
        {
            let res: Result<string> =  store.removeBuyingPolicy(subscriber, policyNumber);
            return this.resultToPromise(res);
        }
        return new Promise((resolve, reject) => reject("subscriber or store wasn't found"));
    }

    public addDiscountPolicy(sessionId: string, storeId: number, name: string, discount: tDiscount): Promise<string> {
        Logger.log(`addDiscountPolicy : sessionId:${sessionId} , storeId:${storeId}, discountName:${name}`);
        if(name === '' || name === undefined || name === null){
            return new Promise((resolve,reject) => { reject("invalid discount name")});
        }
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let store: Store = StoreDB.getStoreByID(storeId);
        if(subscriber !== undefined && store !== undefined)
        {
            let res: Result<string> =  store.addDiscount(subscriber, name, discount);
            return this.resultToPromise(res);
        }
        return new Promise((resolve, reject) => reject("subscriber or store wasn't found"));
    }

    public removeDiscountPolicy(sessionId: string, storeId: number, policyNumber: number): Promise<string> {
        Logger.log(`removeDiscountPolicy : sessionId:${sessionId} , storeId:${storeId}, policyNumber:${policyNumber}`);
        if(policyNumber < 0){
            return new Promise((resolve,reject) => { reject("invalid policy number")});
        }
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let store: Store = StoreDB.getStoreByID(storeId);
        if(subscriber !== undefined && store !== undefined)
        {
            let res: Result<string> =  store.removeDiscountPolicy(subscriber, policyNumber);
            return this.resultToPromise(res);
        }
        return new Promise((resolve, reject) => reject("subscriber or store wasn't found"));
    }
    public getSubscriberPurchaseHistory(sessionId: string, subscriberToSeeId: number): Promise<any>
    {
        Logger.log(`getSubscriberPurchaseHistory : sessionId:${sessionId} , subscriberId:${subscriberToSeeId}`);
        let watcher: Subscriber = this.logged_subscribers.get(sessionId);
        let watchee: Subscriber = Authentication.getSubscriberById(subscriberToSeeId)
        let requestingUserId = watcher.getUserId();
        if (watcher !== undefined)
            if (Authentication.isSystemManager(requestingUserId))
            {
                return new Promise((resolve, reject) => resolve(watchee.getPurchaseHistory()));
            }
        return new Promise((resolve, reject) => reject("user don't have permissions"));
    }

    public getMyPurchaseHistory(sessionId: string): Promise<any>
    {
        Logger.log(`getMyPurchaseHistory : sessionId:${sessionId}`);
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let myId = subscriber.getUserId();
        if (subscriber !== undefined)
            return new Promise((resolve, reject) => resolve(Purchase.getCompletedTransactionsForUser(myId)));
        return new Promise((resolve, reject) => reject("user don't have permissions"));
    }

    //this function is used by subscribers that wants to see stores's history
    public getStorePurchaseHistory(sessionId: string, storeId: number): Promise<Transaction[]>
    {
        Logger.log(`getStorePurchaseHistory : sessionId:${sessionId} ,storeId: ${storeId}`);
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        if (subscriber === undefined)
            return new Promise((resolve, reject) => reject("User not logged in"));
        let store: Store = StoreDB.getStoreByID(storeId);
        if(!store.permittedToViewHistory(subscriber) && !Authentication.isSystemManager(subscriber.getUserId()) )
            return new Promise((resolve, reject) => reject("user don't have system manager permissions"));
        return new Promise((resolve, reject) => resolve(Purchase.getCompletedTransactionsForStore(storeId)));
    }

    public deleteManagerFromStore(sessionId: string, managerToDelete: number, storeId: number): Promise<string>
    {
        Logger.log(`deleteManagerFromStore : sessionId:${sessionId},managerToDelete:${managerToDelete}, storeId:${storeId}`);
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let store: Store = StoreDB.getStoreByID(storeId);
        if(subscriber !== undefined && store !== undefined)
        {
            let res: Result<string> = store.deleteManager(subscriber, managerToDelete );
            if(isOk(res))
            {
                let value = res.value;
                return new Promise((resolve, reject) =>
                {
                    resolve(value);
                })
            }
            else
            {
                let error = res.message;
                return new Promise((resulve, reject) =>
                {
                    reject(error);
                })
            }
        }
        return new Promise((resolve, reject) => reject("wrong parameter given"));
    }

    public editStaffPermission(sessionId: string, managerToEditId: number, storeId: number, permissionMask: number):Promise<string>
    {
        Logger.log(`editStaffPermission : sessionId:${sessionId},managerToEditId:${managerToEditId}, storeId:${storeId}, permissionMask:${permissionMask}`);
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let store: Store = StoreDB.getStoreByID(storeId);
        if(subscriber !== undefined && store !== undefined)
        {
            let res: Result<string> = store.editStaffPermission(subscriber, managerToEditId, permissionMask);
            if(isOk(res))
            {
                let value = res.value;
                return new Promise((resolve, reject) =>
                {
                    resolve(value);
                })
            }
            else
            {
                let error = res.message;
                return new Promise((resulve, reject) =>
                {
                    reject(error);
                })
            }
        }
        return new Promise((resolve, reject) => reject("wrong parameter given"));
    }

    public appointStoreOwner(sessionId: string, storeId: number, newOwnerUsername: string): Promise<string>
    {
        Logger.log(`appointStoreOwner : sessionId:${sessionId} , storeId:${storeId}, newOwnerUsername:${newOwnerUsername}`);
        if(newOwnerUsername === '' || newOwnerUsername === undefined || newOwnerUsername === null){
            return new Promise((resolve,reject) => { reject("invalid new owner Username")})
        }
        let appointer: Subscriber = this.logged_subscribers.get(sessionId);
        let store: Store = StoreDB.getStoreByID(storeId);
        let res: Result<string> = store.appointStoreOwner(appointer, Authentication.getSubscriberByName(newOwnerUsername));
        if(isOk(res))
        {
            let value = res.value;
            return new Promise((resolve, reject) =>
            {
                resolve(value);
            })
        }
        else
        {
            let error = res.message;
            return new Promise((resulve, reject) =>
            {
                reject(error);
            })
        }
    }

    public appointStoreManager(sessionId: string, storeId: number, newManagerUsername: string): Promise<string>
    {
        Logger.log(`appointStoreManager : sessionId:${sessionId} , storeId:${storeId}, newManagerUsername:${newManagerUsername}`);
        if(newManagerUsername === '' || newManagerUsername === undefined || newManagerUsername === null){
            return new Promise((resolve,reject) => { reject("invalid new Manager Username")})
        }
        let appointer: Subscriber = this.logged_subscribers.get(sessionId);
        let store: Store = StoreDB.getStoreByID(storeId);
        let res: Result<string> =  store.appointStoreManager(appointer, Authentication.getSubscriberByName(newManagerUsername));
        if(isOk(res))
        {
            let value = res.value;
            return new Promise((resolve, reject) =>
            {
                resolve(value);
            })
        }
        else
        {
            let error = res.message;
            return new Promise((resulve, reject) =>
            {
                reject(error);
            })
        }
    }

    public getStoreStaff(sessionId: string, storeId: number): Promise<string> {
        Logger.log(`getStoreStaff : sessionId:${sessionId} , storeId:${storeId}`);
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let store: Store = StoreDB.getStoreByID(storeId);
        let res: Result<string> = store.getStoreStaff(subscriber)
        if(isOk(res))
        {
            let value = res.value;
            return new Promise((resolve, reject) =>
            {
                resolve(value);
            })
        }
        else
        {
            let error = res.message;
            return new Promise((resulve, reject) =>
            {
                reject(error);
            })
        }
    }

    public getUsername(sessionId: string): Promise<string>
    {
        let user = this.logged_subscribers.get(sessionId);
        if(user !== undefined)
        {
            return new Promise((resolve, reject) => resolve(user.getUsername()));
        }
        return new Promise((res, rej) => res("guest"));
    }

    private static getSessionId()
    {
        let id = String(this.lastSessionId++ + Math.random())
        return createHash('sha1').update(id).digest('hex');
    }

    public  getUserStores(sessionId:string) : Promise<{}>
    {
        Logger.log(`getUserStores : sessionId:${sessionId}`);
        let subscriber = this.logged_subscribers.get(sessionId);
        if(subscriber !== undefined)
        {
            return new Promise((resolve, reject) => resolve(subscriber.getStores()));
        }
        return new Promise((res, rej) => rej("subscriber not logged in"));
    }



    public getSubscriberId(sessionId: string): number {
        let subscriber = this.logged_subscribers.get(sessionId);
        if(subscriber === undefined)
        {
            return -1;
        }
        return subscriber.getUserId();
    }

    //------------------------------------------functions for tests-------------------------
    public get_logged_guest_users()
    {
        return this.logged_guest_users;
    }

    public get_logged_subscribers()
    {
        return this.logged_subscribers;
    }

    public get_logged_system_managers()
    {
        return this.logged_system_managers;
    }

    public clear() : void
    {
        this.logged_guest_users = new Map();
        this.logged_subscribers = new Map();
        this.logged_system_managers = new Map();
        Authentication.clean();
        StoreDB.clear();
        ProductDB.clear();
        Purchase.clear();
    }

}