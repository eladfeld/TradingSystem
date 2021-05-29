import { Logger } from "../Logger";
import { Store } from "./store/Store";
import { Appointment } from "./user/Appointment";
import { Login } from "./user/Login";
import { Register } from "./user/Register";
import { Subscriber } from "./user/Subscriber";
import { PaymentMeans, SupplyInfo, User } from "./user/User";
// import { isFailure,isOk, makeFailure, makeOk, Result } from "../Result";
import fs from 'fs';
import path, { resolve } from 'path'
import { buyingOption } from "./store/BuyingOption";
import { Authentication } from "./user/Authentication";
import { StoreDB } from "./store/StoreDB";
import Purchase from "./purchase/Purchase";
import { PaymentInfo } from "./purchase/PaymentInfo";
import Transaction from "./purchase/Transaction";
import { ProductDB } from "./store/ProductDB";
import { MakeAppointment } from "./user/MakeAppointment";
import { Publisher } from "./notifications/Publisher";
import { createHash } from 'crypto';
import { SpellChecker } from "./apis/spellchecker";
import { SpellCheckerAdapter } from "./SpellCheckerAdapter";
import { tPredicate } from "./discount/logic/Predicate";
import { tDiscount } from "./discount/Discount";
import { rejects } from "assert";
import { StoreProduct } from "./store/StoreProduct";

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
        if(!(this.initPaymentSystem() && this.initSupplySystem() && this.initSystemManagers()))
        {
            Logger.error("system could not initialized properly!");
        }
    }

    private initSupplySystem() : boolean
    {
        //TODO: handshake
        return true;
    }

    private initPaymentSystem() : boolean
    {
        //TODO: handshake
        return true;
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

    //++user enter the system
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

    //++
    public exit(sessionId: string): void
    {
        Logger.log(`exit : sessionId:${sessionId}`);
        this.logged_guest_users.delete(sessionId);
        this.logged_subscribers.delete(sessionId);
        this.logged_system_managers.delete(sessionId);
    }

    //++
    public logout(sessionId: string): Promise<string>
    {
        Logger.log(`logout : sessionId:${sessionId}`);
        this.exit(sessionId);
        let user: User = new User();

        //when someone logs out he is guest again
        this.logged_guest_users.set(sessionId,user);
        return new Promise( (resolve,reject) => { resolve(sessionId)});
    }

    //++
    public register(username: string, password: string, age:number): Promise<string>
    {
        Logger.log(`register : username:${username}`);

        if(username === '' || username === undefined || username === null){
            return new Promise((resolve,reject) => { reject("invalid username name")})
        }
        if(password === '' || password === undefined || password === null){
            return new Promise((resolve,reject) => { reject("invalid password")})
        }
        if(age < 1 || age === undefined || age === null){
            return new Promise((resolve,reject) => { reject("invalid age")})
        }
        

        let regp =Register.register(username, password, age);
        return new Promise ((resolve,reject) => {
            regp.then ( _ => {
                resolve("registered")
            })
            .catch( error => {
                reject(error)
            })
        })
    }

    //++
    public login(sessionId: string, username: string, password: string): Promise<Subscriber>
    {
        Logger.log(`login : sessionId:${sessionId} , username:${username}`);

        if(username === '' || username === undefined || username === null)
            return Promise.reject("invalid username name")
        if(password === '' || password === undefined || password === null)
            return Promise.reject("invalid password")
        if(this.logged_guest_users.get(sessionId) === undefined)
        {
            Logger.log(`login => user didn't enter the system`);
            return new Promise( (resolve,reject) => {reject("user didn't enter the system")});
        }

        let loginp: Promise<Subscriber> =  Login.login(username, password);

        return new Promise ( (resolve,reject) => {
            loginp.then( subscriber => {
                setTimeout( function () { Publisher.get_instance().send_pending_messages(subscriber)} , 1000) // just to let wss connection to establish

                this.logged_guest_users.set(sessionId,subscriber)
                this.logged_subscribers.set(sessionId,subscriber);
                if(subscriber.isSystemManager())
                    this.logged_system_managers.set(sessionId,subscriber);
                resolve(subscriber);
            })
            .catch( error => {
                Logger.log(`login => ${error}`);
                reject(`login => ${error}`);
            })
        })
    }

    //++
    public getStoreInfo(sessionId : string ,storeId: number): Promise<string>
    {
        Logger.log(`getStoreInfo : sessionId:${sessionId} , storeId:${storeId}`);
        if(storeId === undefined || storeId === null){
            return Promise.reject("invalid storeId")
        }
        
        let user = this.logged_guest_users.get(sessionId)
            if (user === undefined)
                return Promise.reject("user is not logged in")

        let storep = StoreDB.getStoreByID(storeId);
        return new Promise((resolve, reject) => {
            storep.then( store => {
                let infop = store.getStoreInfoResult(user.getUserId())
                infop.then( info => {
                    resolve(info)
                })
                .catch( error => reject(error))
            })
            .catch( error => reject(error))
        })
    }

    //++
    public getPruductInfoByName(sessionId : string, productName: string): Promise<string>
    {
        Logger.log(`getPruductInfoByName : sessionId:${sessionId}, productName: ${productName}`);
        return StoreDB.getPruductInfoByName(productName);
    }

    //++
    public getPruductInfoByCategory(sessionId : string, category: string): Promise<string>
    {
        Logger.log(`getPruductInfoByCategory : sessionId:${sessionId} , category:${category}`);
        return StoreDB.getPruductInfoByCategory(category);
    }

    //--
    public getPruductInfoAbovePrice(userId : number, price: number): Promise<string>
    {
        Logger.log(`getPruductInfoAbovePrice : userId:${userId} , price:${price}`);
        return StoreDB.getProductInfoAbovePrice(price);
    }

    //--
    public getPruductInfoBelowPrice(userId : number, price: number): Promise<string>
    {
        Logger.log(`getPruductInfoBelowPrice : userId:${userId} , price:${price}`);
        return StoreDB.getProductInfoAbovePrice(price);
    }

    //--
    public getPruductInfoByStore(userId : number, store: string): Promise<string>
    {
        Logger.log(`getPruductInfoByStore : userId:${userId} , store:${store}`);
        return StoreDB.getPruductInfoByStore(store);
    }

    //++
    public addProductTocart(sessionId: string, storeId: number, productId: number, quantity: number): Promise<string>
    {
        Logger.log(`addProductTocart : sessionId:${sessionId} , storeId: ${storeId} , productId:${productId} , quantity: ${quantity}`);
        let user: User = this.logged_guest_users.get(sessionId);
        if (user !== undefined)
        {
            let addp = user.addProductToShoppingCart(storeId, productId, quantity);
            return new Promise ((resolve,reject) => {
                addp.then(_ => {
                    resolve("product added to cart");
                })
                .catch ( error => reject(error))
            })
        }
        return Promise.reject("user not found");
    }

    //++
    public addCategoryToRoot(sessionId: string, storeId: number, category: string): Promise<string>
    {
        Logger.log(`addCategoryToRoot : sessionId:${sessionId} , storeId: ${storeId} , category:${category}`);
        if(category === '' || category === undefined || category === null){
            return Promise.reject("invalid category Name")
        }
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);

        if (subscriber === undefined)
            return Promise.reject("user not found");

        let storep = StoreDB.getStoreByID(storeId);
        return new Promise( (resolve,reject) => {
            storep.then( store => {
                let addcatp = store.addCategoryToRoot(category)
                addcatp.then( msg => {
                    SpellCheckerAdapter.get_instance().add_category(category);
                    resolve(msg);
                })
                .catch( error => reject(error))
            })
            .catch( error => reject(error))
        })        
    }

    //++
    public addCategory(sessionId: string, storeId: number, categoryFather:string, category: string): Promise<string>
    {
        Logger.log(`addCategory : sessionId:${sessionId} , storeId: ${storeId} , categoryFather:${categoryFather} , category:${category}`);
        if(category === '' || category === undefined || category === null){
            return Promise.reject("invalid category Name")
        }

        if(categoryFather === '' || categoryFather === undefined || categoryFather === null){
            return Promise.reject("invalid categoryFather Name");
        }

        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        if(subscriber === undefined)
            return Promise.reject("user not found");

        let storep = StoreDB.getStoreByID(storeId);
        return new Promise( (resolve,reject) => {
            storep.then( store => {
                let addcatp = store.addCategory(categoryFather, category)
                addcatp.then( msg => {
                    SpellCheckerAdapter.get_instance().add_category(category);
                    resolve(msg)
                })
                .catch( error => reject(error))
            })
            .catch( error => reject(error))
        })
    }

    //++
    public getCartInfo(sessionId: string): Promise<string>
    {
        Logger.log(`getCartInfo : sessionId:${sessionId}`);
        let user: User = this.logged_guest_users.get(sessionId);
        if (user !== undefined)
        {
            let cart: string = user.GetShoppingCart();
            return Promise.resolve(cart);   
        }
        return Promise.reject("user not found");
    }

    //++
    public editCart(sessionId: string , storeId : number , productId : number , newQuantity : number): Promise<string>
    {
        Logger.log(`editCart : sessionId:${sessionId} , storeId:${storeId} , productId:${productId} , newQuantity:${newQuantity}`);
        if(newQuantity < 0|| newQuantity === undefined || newQuantity === null){
            return Promise.reject("invalid quantity")
        }
        
        let user: User = this.logged_guest_users.get(sessionId);
        if (user !== undefined)
        {
            let editp = user.editCart(storeId , productId , newQuantity);
            return new Promise((resolve,reject) => {
                editp.then( msg => {
                    resolve(msg)
                })
                .catch(error => {
                    reject(error)
                })
            })
        }
        return Promise.reject("user not found");
    }

    //--
    public checkoutBasket(sessionId: string, shopId: number, supply_address: string ): Promise<boolean>
    {
        Logger.log(`checkoutBasket : sessionId:${sessionId} , shopId:${shopId}  , supplyInfo:${supply_address}`);
        let user: User = this.logged_guest_users.get(sessionId);
        if (user !== undefined)
        {
            let checkoutp = user.checkoutBasket(shopId, supply_address);
            return new Promise((resolve,reject) => {
                checkoutp.then( res => resolve(res) )
                .catch(error => reject(error))
            })
        }
        return Promise. reject("user not found");
    }

    //--
    public checkoutSingleProduct(sessionId : string, productId: number, quantity : number , storeId : number , supply_address: string): Promise<string>
    {
        Logger.log(`checkoutSingleProduct : sessionId : ${sessionId}, productId: ${productId}, quantity :${quantity} , storeId : ${storeId},  , supplyInfo:${supply_address}`);
        supply_address = " down da block";
        if(supply_address === ''|| supply_address === undefined || supply_address === null){
            return Promise.reject("invalid user Address")
        }
        if(quantity < 0|| quantity === undefined || quantity === null){
            return Promise.reject("invalid quantity")
        }

        let user: User = this.logged_guest_users.get(sessionId);
        if (user !== undefined)
        {
            let checkoutp = user.checkoutSingleProduct(productId  , quantity,  supply_address, storeId , buyingOption.INSTANT);
            return new Promise((resolve,reject) => {
                checkoutp.then( msg => resolve(msg))
                .catch(error => reject(error))
            })
        }
        return Promise.reject("user not found");
    }

    //++
    public completeOrder(sessionId : string , storeId : number , paymentInfo : PaymentInfo, userAddress: string) : Promise<boolean>
    {
        Logger.log(`completeOrder: sessionId : ${sessionId}, storeId:${storeId}, paymentInfo:${paymentInfo}`);
        // if(userAddress === ''|| userAddress === undefined || userAddress === null){
        //     return new Promise((resolve,reject) => { reject("invalid user Address")})
        // }

        let user: User = this.logged_guest_users.get(sessionId);
        if (user === undefined)
            return Promise.reject("user not found")
        
        let storep = StoreDB.getStoreByID(storeId);
        return new Promise((resolve,reject) => {
            storep.then( store => {
                let completep = store.completeOrder(user.getUserId(), paymentInfo, userAddress);
                completep.then( complete => {
                    resolve(complete)
                })
                .catch( error => reject(error))
            })
            .catch( error => reject(error))
        })
    }


    //++
    public openStore(sessionId: string, storeName : string , bankAccountNumber : number ,storeAddress : string): Promise<Store>
    {
        Logger.log(`openStore : sessionId:${sessionId} , bankAccountNumber:${bankAccountNumber} , storeAddress:${storeAddress} `);

        //illegal paramters
        if(storeName === ''|| storeName === undefined || storeName === null){
            return Promise.reject("invalid store Name")
        }
        if(storeAddress === ''|| storeAddress === undefined || storeAddress === null){
            return Promise.reject("invalid store address")
        }
        if(bankAccountNumber < 0|| bankAccountNumber === undefined || bankAccountNumber === null){
            return Promise.reject("invalid bank Account Number")
        }

        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        if(subscriber !== undefined)
        {
            let storep = StoreDB.getStoreByName(storeName);
            return new Promise ((resolve,reject) => {
                storep.then( _ => reject("storename used"))
                .catch( _ => {
                    let store: Store = new Store(subscriber.getUserId(), storeName, bankAccountNumber, storeAddress);
                    MakeAppointment.appoint_founder(subscriber, store);
                    Publisher.get_instance().register_store(store.getStoreId(),subscriber);
                    SpellCheckerAdapter.get_instance().add_storeName(storeName);
                    resolve(store)
                })
            })
        }
        return Promise.reject("user not found");
    }

    //++
    public editStoreInventory(sessionId: string, storeId: number, productId: number, quantity: number): Promise<string>
    {
        Logger.log(`editStoreInventory : sessionId:${sessionId} , storeId:${storeId}, productId:${productId}, quantity:${quantity}`);
        if(quantity < 0|| quantity === undefined || quantity === null){
            return Promise.reject("invalid quantity")
        }

        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        if (subscriber === undefined)
            return Promise.reject("subscriber wasn't found");

        let storep = StoreDB.getStoreByID(storeId);
        return new Promise ((resolve,reject) => {
            storep.then( store => {
                let setp =  store.setProductQuantity(subscriber, productId, quantity);
                setp.then( msg => {
                    resolve(msg)
                })
                .catch( error => reject(error) )
            }).
            catch( error => reject(error))
        })
    }

    //++
    public addNewProduct(sessionId: string, storeId: number, productName: string, categories: string[], price: number, quantity = 0): Promise<number>
    {
        Logger.log(`addNewProduct : sessionId:${sessionId} , storeId:${storeId}, productName:${productName} , categories:${categories} , price:${price} , quantity:${quantity} `);
        if(productName === '' || productName === undefined || productName === null){
            return Promise.reject("invalid product Name")
        }
        if(price < 1|| price === undefined || price === null){
            return Promise.reject("invalid price")
        }
        if(quantity < 0|| quantity === undefined || quantity === null){
            return Promise.reject("invalid quantity")
        }

        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        if (subscriber === undefined)
            return Promise.reject("subscriber or store wasn't found")

        let storep = StoreDB.getStoreByID(storeId);
        return new Promise((resolve,reject) => {
            storep.then( store => {
                let addp =store.addNewProduct(subscriber, productName, categories, price, quantity);
                addp.then( productId => {
                    SpellCheckerAdapter.get_instance().add_productName(productName);
                    resolve(productId)
                })
                .catch( error => reject(error))
            })
            .catch( error => reject(error))
        })
    }

    // //--
    // private resultToPromise = (res: Result<any>):Promise<string> => {
    //     if(isOk(res))
    //     {
    //         let value = res.value;
    //         return new Promise((resolve, reject) =>
    //         {
    //             resolve(value);
    //         })
    //     }
    //     else
    //     {
    //         let error = res.message;
    //         return new Promise((resulve, reject) =>
    //         {
    //             reject(error);
    //         })
    //     }
    // }

    //++
    public addBuyingPolicy(sessionId: string, storeId: number, policyName: string, buyingPolicy: tPredicate):Promise<string> {
        Logger.log(`addBuyingPolicy : sessionId:${sessionId} , storeId:${storeId}, policyName:${policyName}`);
        if(policyName === '' || policyName === undefined || policyName === null){
            return new Promise((resolve,reject) => { reject("invalid policy name")});
        }

        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let storep = StoreDB.getStoreByID(storeId);
        return new Promise((resolve, reject) => {
            storep.then(store => {
                if(subscriber !== undefined && store !== undefined)
                {
                    let addp =  store.addBuyingPolicy(subscriber, policyName, buyingPolicy);
                    addp.then(msg => resolve(msg))
                    .catch( error => reject(error))
                }
                else reject("subscriber or store wasn't found");
            }).
            catch( error => reject(error))
        })
    }

    //++
    public removeBuyingPolicy(sessionId: string, storeId: number, policyNumber: number):Promise<string> {
        Logger.log(`removeBuyingPolicy : sessionId:${sessionId} , storeId:${storeId}, policyNumber:${policyNumber}`);
        if(policyNumber < 0){
            return new Promise((resolve,reject) => { reject("invalid policy number")});
        }
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let storep = StoreDB.getStoreByID(storeId);
        return new Promise ((resolve,reject) => {
            storep.then( store => {
                if(subscriber !== undefined && store !== undefined)
                {
                    let remp =  store.removeBuyingPolicy(subscriber, policyNumber);
                    remp.then( msg =>{
                        resolve(msg)
                    }).catch( error => reject(error))
                }
                else reject("subscriber or store wasn't found");
            }).catch( error => reject(error))
        })
    }

    // public getBuyingPolicies(sessiodId: any, storeId: number): Promise<string> {
    //     Logger.log(`getBuyingPolicies : sessionId:${sessionId} , storeId:${storeId}`);
    //     let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
    //     let store: Store = StoreDB.getStoreByID(storeId);
    //     if(subscriber !== undefined && store !== undefined)
    //     {
    //         let res: Result<string> =  store.getBuyingPolicies(subscriber);
    //         return this.resultToPromise(res);
    //     }
    //     return new Promise((resolve, reject) => reject("subscriber or store wasn't found"));
    // }

    //--
    public addDiscountPolicy(sessionId: string, storeId: number, name: string, discount: tDiscount): Promise<string> {
        Logger.log(`addDiscountPolicy : sessionId:${sessionId} , storeId:${storeId}, discountName:${name}`);
        if(name === '' || name === undefined || name === null){
            return new Promise((resolve,reject) => { reject("invalid discount name")});
        }
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let storep = StoreDB.getStoreByID(storeId);
        return new Promise((resolve, reject) => {
            storep.then(store =>
                {
                    if(subscriber !== undefined && store !== undefined)
                    {
                        let msgp =  store.addDiscount(subscriber, name, discount);
                        msgp.then(msg => resolve(msg))
                        .catch(error => reject(error))
                    }
                    reject(`subscriber or store wasn't found ${JSON.stringify(subscriber)} ${JSON.stringify(store)}`);
                }
            )
            .catch(error => reject(error))
        })

    }

    //++
    public removeDiscountPolicy(sessionId: string, storeId: number, policyNumber: number): Promise<string> {
        Logger.log(`removeDiscountPolicy : sessionId:${sessionId} , storeId:${storeId}, policyNumber:${policyNumber}`);
        if(policyNumber < 0){
            return new Promise((resolve,reject) => { reject("invalid policy number")});
        }
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let storep = StoreDB.getStoreByID(storeId);
        return new Promise((resolve,reject) => {
            storep.then( store => {
                if(subscriber !== undefined && store !== undefined)
                {
                    let remp =  store.removeDiscountPolicy(subscriber, policyNumber);
                    remp.then( msg => resolve(msg))
                    .catch( error => reject(error))
                }
                else reject("subscriber or store wasn't found")
            })
            .catch(error => reject(error))
        })
    }

    //++
    // this function is for system managers asking to see subscribers history
    public getSubscriberPurchaseHistory(sessionId: string, subscriberToSeeId: number): Promise<any>
    {
        Logger.log(`getSubscriberPurchaseHistory : sessionId:${sessionId} , subscriberId:${subscriberToSeeId}`);
        let watcher: Subscriber = this.logged_subscribers.get(sessionId);
        let watcheep = Authentication.getSubscriberById(subscriberToSeeId)
        return new Promise((resolve,reject) => {
            watcheep.then(watchee => {
                if (watcher)
                {
                    let watcherUserId = watcher.getUserId();
                    let issystemManagerp = Authentication.isSystemManager(watcherUserId)
                    issystemManagerp.then( ismanager => {
                        if (ismanager){
                            let historyp = watchee.getPurchaseHistory()
                            historyp.then( history => { resolve(history) })
                            .catch ( error => reject(error))
                        }
                        else reject("user doesnt have permissions")
                    })
                    .catch( error => reject(error) )
                }
                else reject("user wasnt found")
            })
            .catch( error => reject(error))
        })
    }

    //++
    public getMyPurchaseHistory(sessionId: string): Promise<any>
    {
        Logger.log(`getMyPurchaseHistory : sessionId:${sessionId}`);
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let myId = subscriber.getUserId();
        if (subscriber !== undefined)
            return Purchase.getCompletedTransactionsForUser(myId);
        return Promise.reject("user don't have permissions");
    }

    //this function is used by subscribers that wants to see stores's history
    //++
    public getStorePurchaseHistory(sessionId: string, storeId: number): Promise<Transaction[]>
    {
        Logger.log(`getStorePurchaseHistory : sessionId:${sessionId} ,storeId: ${storeId}`);
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        if (subscriber === undefined)
            return Promise.reject("User not logged in");
        let storep = StoreDB.getStoreByID(storeId);
        return new Promise ((resolve,reject) => {
            storep.then( store => {
                let sysmanagerp = Authentication.isSystemManager(subscriber.getUserId());
                sysmanagerp.then ( isSysManager => {
                    if(!store.permittedToViewHistory(subscriber) && !isSysManager)
                        reject("user don't have system manager permissions");
                    resolve(Purchase.getCompletedTransactionsForStore(storeId));
                })
                .catch( error => reject(error))
            }).catch(error => reject(error))
        })
    }

    //++
    public deleteManagerFromStore(sessionId: string, managerToDelete: number, storeId: number): Promise<string>
    {
        Logger.log(`deleteManagerFromStore : sessionId:${sessionId},managerToDelete:${managerToDelete}, storeId:${storeId}`);
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let storep = StoreDB.getStoreByID(storeId);
        return new Promise((resolve, reject) => {
            storep.then(store =>
                {
                    if(subscriber !== undefined && store !== undefined)
                    {
                        let msgp: Promise<string> = store.deleteManager(subscriber, managerToDelete );
                        msgp.then(msg => resolve(msg))
                        .catch(error => reject(error))
                    } 
                    else reject("wrong parameter given");
                })
                .catch(error => reject(error))
        })
    }

    //++
    public editStaffPermission(sessionId: string, managerToEditId: number, storeId: number, permissionMask: number):Promise<string>
    {
        Logger.log(`editStaffPermission : sessionId:${sessionId},managerToEditId:${managerToEditId}, storeId:${storeId}, permissionMask:${permissionMask}`);
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let storep = StoreDB.getStoreByID(storeId);
        return new Promise((resolve,reject) => {
            storep.then( store => {
                if(subscriber !== undefined && store !== undefined)
                {
                    let editp = store.editStaffPermission(subscriber, managerToEditId, permissionMask);
                    editp.then ( msg => {
                        resolve(msg)
                    })
                    .catch(error => reject(error))
                }
                else reject("wrong parameter given")
            }).catch( error => reject(error))
        })
    }

    //++
    public appointStoreOwner(sessionId: string, storeId: number, newOwnerUsername: string): Promise<string>
    {
        Logger.log(`appointStoreOwner : sessionId:${sessionId} , storeId:${storeId}, newOwnerUsername:${newOwnerUsername}`);
        if(newOwnerUsername === '' || newOwnerUsername === undefined || newOwnerUsername === null){
            return Promise.reject("invalid new owner Username")
        }

        let appointer: Subscriber = this.logged_subscribers.get(sessionId);
        let storep = StoreDB.getStoreByID(storeId);
        let newOwnerp = Authentication.getSubscriberByName(newOwnerUsername)
        return new Promise ((resolve,reject) => {
            newOwnerp.then ( newOwner => {
                storep.then(store =>
                    {
                        let appownerp = store.appointStoreOwner(appointer, newOwner );
                        appownerp.then( msg => { resolve(msg)})
                        .catch( error => reject(error))
                    }
                )
                .catch(error => reject(error))
            })
            .catch( error => reject(error))
        })
    }

    //++
    public appointStoreManager(sessionId: string, storeId: number, newManagerUsername: string): Promise<string>
    {
        Logger.log(`appointStoreManager : sessionId:${sessionId} , storeId:${storeId}, newManagerUsername:${newManagerUsername}`);
        if(newManagerUsername === '' || newManagerUsername === undefined || newManagerUsername === null){
            return Promise.reject("invalid new Manager Username")
        }

        let appointer: Subscriber = this.logged_subscribers.get(sessionId);
        let storep = StoreDB.getStoreByID(storeId);
        let newManagerp = Authentication.getSubscriberByName(newManagerUsername)
        
        return new Promise ((resolve,reject) => {
            storep.then (store => {
                newManagerp.then ( newmanager => {
                    let appmanp =  store.appointStoreManager(appointer, newmanager);
                    appmanp.then( msg => {
                        resolve(msg)
                    })
                    .catch( error => reject(error))
                })
                .catch( error => reject(error))
            })
            .catch(error => reject(error))
        })
    }

    public getStoreStaff(sessionId: string, storeId: number): Promise<string> {
        Logger.log(`getStoreStaff : sessionId:${sessionId} , storeId:${storeId}`);
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let storep = StoreDB.getStoreByID(storeId);
        return new Promise((resolve,reject) => {
            storep.then( store => {
                let getp = store.getStoreStaff(subscriber)
                getp.then ( info => {
                    resolve(info)
                })
                .catch ( error => { reject(error)})
            })
            .catch(error => reject(error))
        })
    }

    //++
    public getUsername(sessionId: string): Promise<string>
    {
        let user = this.logged_subscribers.get(sessionId);
        if(user !== undefined)
        {
            return Promise.resolve(user.getUsername());
        }
        return Promise.resolve("guest");
    }

    //++
    private static getSessionId()
    {
        let id = String(this.lastSessionId++ + Math.random())
        return createHash('sha1').update(id).digest('hex');
    }

    //++
    public  getUserStores(sessionId:string) : Promise<{}>
    {
        Logger.log(`getUserStores : sessionId:${sessionId}`);
        let subscriber = this.logged_subscribers.get(sessionId);
        if(subscriber !== undefined)
        {
            return Promise.resolve(subscriber.getStores());
        }
        return Promise.reject("subscriber not logged in");
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
        StoreDB.clear();
        ProductDB.clear();
        Purchase.clear();
    }

}