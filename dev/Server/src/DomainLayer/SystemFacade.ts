import { Logger } from "../Logger";
import { Store } from "./store/Store";
import { Login } from "./user/Login";
import { Register } from "./user/Register";
import { Subscriber } from "./user/Subscriber";
import { PaymentMeans, SupplyInfo, User } from "./user/User";
import fs from 'fs';
import path, { resolve } from 'path'
import { buyingOption } from "./store/BuyingOption";
import { Authentication } from "./user/Authentication";
import Purchase, { tPaymentInfo, tShippingInfo } from "./purchase/Purchase";
import Transaction from "./purchase/Transaction";
import { MakeAppointment } from "./user/MakeAppointment";
import { Publisher } from "./notifications/Publisher";
import { createHash } from 'crypto';
import { SpellCheckerAdapter } from "./SpellCheckerAdapter";
import { tPredicate } from "./discount/logic/Predicate";
import { tDiscount } from "./discount/Discount";
import SupplySystemReal from "./apis/SupplySystemReal";
import PaymentSystemReal from "./apis/PaymentSystemReal";
import { PATH_TO_SYSTEM_MANAGERS, SHOULD_RESET_DATABASE } from "../../config";
import { initTables } from "../DataAccessLayer/connectDb";
import { initLastStoreId } from "./store/Common";
import { DiscountOption } from "./store/DiscountOption";
import DiscountPolicy from "./discount/DiscountPolicy";
import BuyingPolicy from "./policy/buying/BuyingPolicy";
import { login_stats, userType } from "../DataAccessLayer/interfaces/iLoginStatsDB";
import { DB } from "../DataAccessLayer/DBfacade";
import { OfferManager } from "./offer/OfferManager";
import { Offer } from "./offer/Offer";
import { StoreProduct } from "./store/StoreProduct";
import UniversalPolicy,{initUniversalPolicy} from "./policy/buying/UniversalPolicy";
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
    }

    public async init(){
        try{
        let init_managers = true;
        await initTables();
        await initUniversalPolicy();
        let init_supply = await this.initSupplySystem();
        let init_payment =  await this.initPaymentSystem()
        if(SHOULD_RESET_DATABASE)
        {
            init_managers = await this.initSystemManagers();
        }
        return new Promise<void>((resolve,reject) => {
            this.initIdisfromDB().then( async _ =>{
                if(!((init_managers && init_supply  && init_payment)))
                {
                    Logger.error("system could not initialized properly!");
                    reject("failed to init trading system. check api connections and system managers")
                    throw new Error("failed to init trading system. check api connections and system managers");
                }
                else resolve()
            }
            )
        })
        }
        catch(e){
            Logger.error(e)
            throw new Error("problem initializing system")
        }


    }

    private async initIdisfromDB()
    {
        await Transaction.initLastTransactionId();
        await DiscountPolicy.initLastDiscountId();
        await BuyingPolicy.initLastBuyingId();
        await initLastStoreId();
        await User.initLastId();
        await StoreProduct.initLastProductId()
    }

    private async initSupplySystem() : Promise<boolean>
    {
        let initialization = undefined;
        try{
         initialization = await SupplySystemReal.init();
        }
        catch(e){
            Logger.error("couldn't intialize suplly system")
            throw new Error(e)
        }
        return initialization > 0 ? true : false;
    }

    private async initPaymentSystem() : Promise<boolean>
    {
        let initialization = undefined
        try{
        initialization = await PaymentSystemReal.init();
        }
        catch(e){
            Logger.error("couldn't intialize payment system")
            throw new Error(e)
        }
        return initialization > 0 ? true : false;
    }

    private isNonEmptyString = (str: string):boolean =>{
        return str !== '' && str !== undefined && str !== null;
    }

    // public complain= async(sessionId:string, title:string, body:string):Promise<string> => {
    //     Logger.log(`complain : sessionId:${sessionId} , title: ${title} , body:${body.substring(0,20)}...`);
    //     if(!this.isNonEmptyString(title))
    //         return new Promise((resolve,reject) => { reject("invalid message title")})
    //     if(!this.isNonEmptyString(body))
    //         return new Promise((resolve,reject) => { reject("invalid message body")})

    //     let user: User = this.logged_guest_users.get(sessionId);
    //     if (user !== undefined)
    //     {
    //         ComplaintsDBDummy.addComplaint(user.getUserId(), title, body);
    //         return new Promise((resolve, reject) => resolve("Your complaint has been received."));
    //     }
    //     return new Promise((resolve, reject) => reject("user not found"));
    // }

    // public getSystemComplaints = async (sessionId:string):Promise<tComplaint[][]> => {
    //     Logger.log(`getSystemComplaints : sessionId:${sessionId}`);
    //     let user: User = this.logged_guest_users.get(sessionId);
    //     if (user !== undefined)
    //     {
    //         const complaints:tComplaint[][] = await ComplaintsDBDummy.getComplaints()
    //         return new Promise((resolve, reject) => resolve(complaints));
    //     }
    //     return new Promise((resolve, reject) => reject("user not found"));
    // }

    // public deleteComplaint = async (sessionId:string, messageId:number):Promise<string> => {
    //     Logger.log(`deleteComplaint : sessionId:${sessionId} messageId: ${messageId}`);
    //     let user: User = this.logged_guest_users.get(sessionId);
    //     if (user !== undefined)
    //     {
    //         await ComplaintsDBDummy.deleteComplaint(messageId);
    //         return new Promise((resolve, reject) => resolve("complaint successfully deleted."));
    //     }
    //     return new Promise((resolve, reject) => reject("user not found"));
    // }


    isSystemManager(sessionId: any) {
        return Promise.resolve(this.logged_system_managers.has(sessionId));
    }


    public replyToComplaint = (sessionId:string, title:string, body:string, id:number):Promise<string> =>{
        return new Promise((resolve, reject) => resolve("replying not yet supported"));
    }

    public getUsernames = async(sessionId:string):Promise<string[]> =>{
        return ["feature","not", "yet", "supported"];
    }
    public closeStore = (sessionId:string, storeName:string):Promise<string> =>{
        Logger.log(`closeStore : sessionId:${sessionId} storeName: ${storeName}`);
        if(!this.isNonEmptyString(storeName))
            return new Promise((resolve,reject) => { reject("invalid storeName")});
        let user: User = this.logged_guest_users.get(sessionId);
        if (user !== undefined)
        {
            return new Promise((resolve, reject) => resolve("function not yet supported"));
        }
        return new Promise((resolve, reject) => reject("user not found"));
    }

    public async initSystemManagers() : Promise<boolean>
    {
        try{
            const data = fs.readFileSync(path.resolve(PATH_TO_SYSTEM_MANAGERS) ,  {encoding:'utf8', flag:'r'});
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
                await Authentication.addSystemManager(sub);
            }
            return true
        }
        catch(e){
            Logger.error("couldnt initalize system managers")
            throw new Error(e)
        }
    }

    //++user enter the system
    public enter(): Promise<string>
    {
        Logger.log("new user entered the system");
        let user: User = new User();
        let sessionId = SystemFacade.getSessionId();
        this.logged_guest_users.set(sessionId,user);
        let updatestatsp = DB.updateLoginStats(userType.guest);
        Publisher.get_instance().notify_login_update("$login_stats:guests")
        return new Promise( (resolve,reject) => {
            updatestatsp.then( _ => { resolve(sessionId); })
            .catch(error => reject(error))
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
        Logger.log(`register : username:${username}`);

        if(username === '' || username === undefined || username === null){
            return Promise.reject("invalid username name")
        }
        if(password === '' || password === undefined || password === null){
            return Promise.reject("invalid password")
        }
        if(age < 1 || age === undefined || age === null){
            return Promise.reject("invalid age")
        }
        let regp = Register.register(username, password, age);
        return new Promise ((resolve,reject) => {
            regp.then ( _ => {
                resolve("registered")
            })
            .catch( error => {
                reject(error)
            })
        })
    }

    public login(sessionId: string, username: string, password: string): Promise<Subscriber>
    {
        Logger.log(`login : sessionId:${sessionId} , username:${username}`);//TODO: remove password from log

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
                let ismanagerp = subscriber.isSystemManager()
                ismanagerp.then (issysmanager => {
                    if(issysmanager)
                    {
                        this.logged_system_managers.set(sessionId,subscriber);
                        DB.updateLoginStats(userType.system_manager)
                        Publisher.get_instance().notify_login_update("$login_stats:system_managers")
                    }
                    else{
                        let appointments = subscriber.getAppointments();
                        let ownerapps = appointments.filter((app => app.isOwner()))
                        if (appointments.length == 0){
                            DB.updateLoginStats(userType.subscriber)
                            Publisher.get_instance().notify_login_update("$login_stats:subscribers")
                        }
                        else if (ownerapps.length != 0){
                            DB.updateLoginStats(userType.owner)
                            Publisher.get_instance().notify_login_update("$login_stats:owners")
                        }
                        else{
                            DB.updateLoginStats(userType.manager)
                            Publisher.get_instance().notify_login_update("$login_stats:managers")
                        }
                    }
                })
                resolve(subscriber);
            })
            .catch( error => {
                Logger.log(`login => ${error}`);
                reject(`${error}`);
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

        let storep = DB.getStoreByID(storeId);
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
        return DB.getPruductInfoByName(productName);
    }

    //++
    public getPruductInfoByCategory(sessionId : string, category: string): Promise<string>
    {
        Logger.log(`getPruductInfoByCategory : sessionId:${sessionId} , category:${category}`);
        return DB.getPruductInfoByCategory(category);
    }

    //--
    public getPruductInfoAbovePrice(userId : number, price: number): Promise<string>
    {
        Logger.log(`getPruductInfoAbovePrice : userId:${userId} , price:${price}`);
        return DB.getProductInfoAbovePrice(price);
    }

    //--
    public getPruductInfoBelowPrice(userId : number, price: number): Promise<string>
    {
        Logger.log(`getPruductInfoBelowPrice : userId:${userId} , price:${price}`);
        return DB.getProductInfoBelowPrice(price);
    }

    //--
    public getPruductInfoByStore(userId : number, store: string): Promise<string>
    {
        Logger.log(`getPruductInfoByStore : userId:${userId} , store:${store}`);
        return DB.getPruductInfoByStore(store);
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

        let storep = DB.getStoreByID(storeId);
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

        let storep = DB.getStoreByID(storeId);
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
            return user.GetShoppingCart();
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
            return user.editCart(storeId , productId , newQuantity);
        }
        return Promise.reject("user not found");
    }

    public checkoutBasket(sessionId: string, shopId: number, shippingInfo: tShippingInfo ): Promise<boolean>
    {
        Logger.log(`checkoutBasket : sessionId:${sessionId} , shopId:${shopId}  , supplyInfo:${shippingInfo}`);
        let user: User = this.logged_guest_users.get(sessionId);
        if (user !== undefined)
        {
            let checkoutp = user.checkoutBasket(shopId, shippingInfo);
            return new Promise((resolve,reject) => {
                checkoutp.then( res => resolve(res) )
                .catch(error => reject(error))
            })
        }
        return Promise. reject("user not found");
    }

    public checkoutSingleProduct(sessionId : string, productId: number, quantity : number , storeId : number , shippingInfo:tShippingInfo): Promise<string>
    {
        Logger.log(`checkoutSingleProduct : sessionId : ${sessionId}, productId: ${productId}, quantity :${quantity} , storeId : ${storeId},  , supplyInfo:${shippingInfo}`);
        if( shippingInfo === undefined || shippingInfo === null){
            return new Promise((resolve,reject) => { reject("invalid user Address")})
        }
        if(quantity < 0|| quantity === undefined || quantity === null){
            return Promise.reject("invalid quantity")
        }

        let user: User = this.logged_guest_users.get(sessionId);
        if (user !== undefined)
        {
            let checkoutp = user.checkoutSingleProduct(productId  , quantity,  shippingInfo, storeId , buyingOption.INSTANT);
            return new Promise((resolve,reject) => {
                checkoutp.then( msg => resolve(msg))
                .catch(error => reject(error))
            })
        }
        return Promise.reject("user not found");
    }

    public async completeOrder(sessionId : string , storeId : number , paymentInfo : tPaymentInfo, shippingInfo:tShippingInfo) : Promise<boolean>
    {
        Logger.log(`completeOrder: sessionId : ${sessionId}, storeId:${storeId}, paymentInfo:${paymentInfo}, shippingInfo:${shippingInfo}`);
        // if(userAddress === ''|| userAddress === undefined || userAddress === null){
        //     return new Promise((resolve,reject) => { reject("invalid user Address")})
        // }

        let user: User = this.logged_guest_users.get(sessionId);
        if (user === undefined)
            return Promise.reject("user not found")

        let storep = DB.getStoreByID(storeId);
        return new Promise((resolve,reject) => {
            storep.then( store => {
                let completep = store.completeOrder(user.getUserId(), paymentInfo, shippingInfo);
                completep.then( complete => {
                        resolve(complete)
                })
                .catch( error => reject(error))
            })
            .catch( error => reject(error))
        })
    }


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
            let storep = DB.getStoreByName(storeName);
            return new Promise ((resolve,reject) => {
                storep.then( _ => reject("storename used"))
                .catch( _ => {
                    let storePromise  = Store.createStore(subscriber.getUserId(), storeName, bankAccountNumber, storeAddress)
                    storePromise.then( store => {
                        let founderp = MakeAppointment.appoint_founder(subscriber, store);
                        founderp.then( _ => {
                            Publisher.get_instance().register_store(store.getStoreId(),subscriber);
                            SpellCheckerAdapter.get_instance().add_storeName(storeName);
                            resolve(store)
                        }).catch( error => reject(error))
                    })
                    .catch( error => reject(error))
                })
            })
        }
        return Promise.reject("user not found");
    }

    public editStoreInventory(sessionId: string, storeId: number, productId: number, quantity: number): Promise<string>
    {
        Logger.log(`editStoreInventory : sessionId:${sessionId} , storeId:${storeId}, productId:${productId}, quantity:${quantity}`);
        if(quantity < 0|| quantity === undefined || quantity === null){
            return Promise.reject("invalid quantity")
        }

        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        if (subscriber === undefined)
            return Promise.reject("subscriber wasn't found");

        let storep = DB.getStoreByID(storeId);
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

    public addNewProduct(sessionId: string, storeId: number, productName: string, categories: string[], price: number, quantity = 0, image: string): Promise<number>
    {
        Logger.log(`addNewProduct : sessionId:${sessionId} , storeId:${storeId}, productName:${productName} , categories:${categories} , price:${price} , quantity:${quantity} image:${image}`);
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
            return Promise.reject("subscriber wasn't found")

        let storep = DB.getStoreByID(storeId);
        return new Promise((resolve,reject) => {
            storep.then( store => {
                if(store === undefined)
                {
                    resolve(-1);
                }
                let addp =store.addNewProduct(subscriber, productName, categories, price, quantity, image);
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

    public addBuyingPolicy(sessionId: string, storeId: number, policyName: string, buyingPolicy: tPredicate):Promise<string> {
        Logger.log(`addBuyingPolicy : sessionId:${sessionId} , storeId:${storeId}, policyName:${policyName}`);
        if(policyName === '' || policyName === undefined || policyName === null){
            return new Promise((resolve,reject) => { reject("invalid policy name")});
        }

        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let storep = DB.getStoreByID(storeId);
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

    public removeBuyingPolicy(sessionId: string, storeId: number, policyNumber: number):Promise<string> {
        Logger.log(`removeBuyingPolicy : sessionId:${sessionId} , storeId:${storeId}, policyNumber:${policyNumber}`);
        if(policyNumber < 0){
            return new Promise((resolve,reject) => { reject("invalid policy number")});
        }
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let storep = DB.getStoreByID(storeId);
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

    public addDiscountPolicy(sessionId: string, storeId: number, name: string, discount: tDiscount): Promise<string> {
        Logger.log(`addDiscountPolicy : sessionId:${sessionId} , storeId:${storeId}, discountName:${name}`);
        if(name === '' || name === undefined || name === null){
            return new Promise((resolve,reject) => { reject("invalid discount name")});
        }
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let storep = DB.getStoreByID(storeId);
        return new Promise((resolve, reject) => {
            storep.then(store =>
                {
                    if(subscriber !== undefined && store !== undefined)
                    {
                        let msgp =  store.addDiscount(subscriber, name, discount);
                        msgp.then(msg => resolve(msg))
                        .catch(error => reject(error))
                    }
                    else reject(`subscriber or store wasn't found ${JSON.stringify(subscriber)} ${JSON.stringify(store)}`);
                }
            )
            .catch(error => reject(error))
        })

    }

    public removeDiscountPolicy(sessionId: string, storeId: number, policyNumber: number): Promise<string> {
        Logger.log(`removeDiscountPolicy : sessionId:${sessionId} , storeId:${storeId}, policyNumber:${policyNumber}`);
        if(policyNumber < 0){
            return new Promise((resolve,reject) => { reject("invalid policy number")});
        }
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let storep = DB.getStoreByID(storeId);
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
                            historyp.then( history => { resolve(history)
                            }).catch ( error => reject(error))
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
    public getStorePurchaseHistory(sessionId: string, storeId: number): Promise<Transaction[]>
    {
        Logger.log(`getStorePurchaseHistory : sessionId:${sessionId} ,storeId: ${storeId}`);
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        if (subscriber === undefined)
            return Promise.reject("User not logged in");
        let storep = DB.getStoreByID(storeId);
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

    public deleteManagerFromStore(sessionId: string, managerName: string, storeId: number): Promise<string>
    {
        Logger.log(`deleteManagerFromStore : sessionId:${sessionId},managerToDelete:${managerName}, storeId:${storeId}`);
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let managerp = DB.getSubscriberByUsername(managerName)
        let storep = DB.getStoreByID(storeId);
        return new Promise((resolve, reject) => {
            managerp.then( managerToDelete => {
                storep.then(store =>
                    {
                        if(subscriber !== undefined && store !== undefined)
                        {
                            let msgp: Promise<string> = store.deleteManager(subscriber, managerToDelete.getUserId() );
                            msgp.then(msg => resolve(msg))
                            .catch(error => reject(error))
                        }
                        else reject("wrong parameter given");
                    })
                    .catch(error => reject(error))
            })
            .catch( error => reject(error))
        })
    }

    public editStaffPermission(sessionId: string, managerToEditId: number, storeId: number, permissionMask: number):Promise<string>
    {
        Logger.log(`editStaffPermission : sessionId:${sessionId},managerToEditId:${managerToEditId}, storeId:${storeId}, permissionMask:${permissionMask}`);
        let subscriber: Subscriber = this.logged_subscribers.get(sessionId);
        let storep = DB.getStoreByID(storeId);
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

    public appointStoreOwner(sessionId: string, storeId: number, newOwnerUsername: string): Promise<string>
    {
        Logger.log(`appointStoreOwner : sessionId:${sessionId} , storeId:${storeId}, newOwnerUsername:${newOwnerUsername}`);
        if(newOwnerUsername === '' || newOwnerUsername === undefined || newOwnerUsername === null){
            return Promise.reject("invalid new owner Username")
        }

        let appointer: Subscriber = this.logged_subscribers.get(sessionId);
        let storep = DB.getStoreByID(storeId);
        let newOwnerp = Authentication.getSubscriberByName(newOwnerUsername)
        return new Promise ((resolve,reject) => {
            newOwnerp.then ( newOwner => {
                storep.then(store =>
                    {
                        let appownerp = store.appointStoreOwner(appointer, newOwner );
                        appownerp.then( msg => { 
                            resolve(msg)
                            Publisher.get_instance().register_store(store.getStoreId(), newOwner)
                        })
                        .catch( error => reject(error))
                    }
                )
                .catch(error => reject(error))
            })
            .catch( error => reject(error))
        })
    }

    public async appointStoreManager(sessionId: string, storeId: number, newManagerUsername: string): Promise<string>
    {
        Logger.log(`appointStoreManager : sessionId:${sessionId} , storeId:${storeId}, newManagerUsername:${newManagerUsername}`);
        if(newManagerUsername === '' || newManagerUsername === undefined || newManagerUsername === null){
            return Promise.reject("invalid new Manager Username")
        }

        let appointer: Subscriber = this.logged_subscribers.get(sessionId);
        // appointer = await DB.getSubscriberById(appointer.getUserId())
        let storep = DB.getStoreByID(storeId);
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
        let storep = DB.getStoreByID(storeId);
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

    public getUsername(sessionId: string): Promise<string>
    {
        let user = this.logged_subscribers.get(sessionId);
        if(user !== undefined)
        {
            return Promise.resolve(user.getUsername());
        }
        return Promise.resolve("guest");
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
            return Promise.resolve(subscriber.getStores());
        }
        return Promise.reject("subscriber not logged in");
    }

    getLoginStats(sessionId : string, from:Date, until:Date): Promise<login_stats>
    {
        Logger.log(`getLoginStats: ${sessionId} , from:${from} , until:${until}`)
        let sys_manager = this.logged_system_managers.get(sessionId)
        if (sys_manager !== undefined)
        {
            if (this.isToday(from) || this.isToday(until))
                Publisher.get_instance().register_login(sys_manager)
            return DB.getLoginStats(from, until)
        }
        return Promise.reject("only system managers can ask login stats")
    }

    isToday(date : Date) : boolean
    {

        let today = new Date()
        if (date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear() &&
                    date.getDate() === today.getDate())
            return true;
        return false
    }

    public getSubscriberId(sessionId: string): number {
        let subscriber = this.logged_subscribers.get(sessionId);
        if(subscriber === undefined)
        {
            return -1;
        }
        return subscriber.getUserId();
    }

    OfferResponseByOwner(sessionId: string, response: boolean, storeId: number, offerId: number): Promise<string> {
        let subscriber = this.logged_subscribers.get(sessionId);
        if(subscriber === undefined)
            return Promise.reject("subscriber is not logged in");
        return new Promise((resolve, reject) =>
        {
            DB.getStoreByID(storeId)
            .then(store =>
                {
                    let offerManager = OfferManager.get_instance();
                    if(response)
                    {
                        offerManager.acceptOffer(subscriber, store, offerId)
                        .then(_ => resolve("offer accpted"))
                        .catch(error => reject(error))
                    }
                    else
                    {
                        offerManager.declineOffer(subscriber, store, offerId)
                        .then(_ => resolve("offer decline"))
                        .catch(error => reject(error))
                    }

                })
            .catch(error => reject(error))
        })

    }

    getOffersByStore(storeId: number): Promise<Offer[]> {
        return OfferManager.get_instance().getOffersByStore(storeId);
    }

    getOffersByUser(sessionId: string): Promise<Offer[]> {
        let subscriber = this.logged_subscribers.get(sessionId);
        if(subscriber === undefined){
            return Promise.reject("subscriber is not logged in");
        }
        return OfferManager.get_instance().getOffersByUser(subscriber.getUserId());
    }

    newOffer(sessionId: string, storeId: number, productId: number, bid: number): Promise<string> {
        Logger.log(`newOffer : sessionId:${sessionId} , storeId:${storeId}, productId:${productId} , bid:${bid}`);
        if(bid < 1|| bid === undefined || bid === null){
            return Promise.reject("invalid bid")
        }
        let subscriber = this.logged_subscribers.get(sessionId);
        if(subscriber === undefined){
            return Promise.reject("subscriber is not logged in");
        }
        return new Promise((resolve, reject) =>
        {
            DB.getProductById(productId)
            .then(product => {
                OfferManager.get_instance().newOffer(subscriber, storeId, product, bid);
                resolve('added offer')
            }).catch(err => reject(`failed to add offer`))
        })
    }

    acceptOffer(sessionId: string, storeId: number, offerId: number): Promise<string> {
        let subscriber = this.logged_subscribers.get(sessionId);
        if(subscriber === undefined){
            return Promise.reject("subscriber is not logged in");
        }
        return new Promise((resolve, reject) =>
        {
            DB.getStoreByID(storeId)
            .then(store =>
                {
                    let offerManager = OfferManager.get_instance();
                    offerManager.acceptOffer(subscriber, store, offerId).then(_ => resolve('acceptence registered'))
                    .catch(err => reject('could not accept'))
                })
            .catch(error => reject(error))
        })
    }

    declineOffer(sessionId: string, storeId: number, offerId: number): Promise<string> {
        let subscriber = this.logged_subscribers.get(sessionId);
        if(subscriber === undefined){
            return Promise.reject("subscriber is not logged in");
        }
        return new Promise((resolve, reject) =>
        {
            DB.getStoreByID(storeId)
            .then(store =>
                {
                    let offerManager = OfferManager.get_instance();
                    offerManager.declineOffer(subscriber, store, offerId).then(_ => resolve('offer declined'))
                    .catch(err => reject('could not decline'))
                })
            .catch(error => reject(error))
        })
    }

    counterOffer(sessionId: string, storeId: number, offerId: number, counterPrice: number): Promise<string> {
        Logger.log(`counterOffer : sessionId:${sessionId} , storeId:${storeId}, counterPrice:${counterPrice} , offerId:${offerId}`);
        if(counterPrice < 1|| counterPrice === undefined || counterPrice === null){
            return Promise.reject("invalid counter price")
        }
        let subscriber = this.logged_subscribers.get(sessionId);
        if(subscriber === undefined){
            return Promise.reject("subscriber is not logged in");
        }
        return new Promise((resolve, reject) =>
        {
            DB.getStoreByID(storeId)
            .then(store =>
                {
                    let offerManager = OfferManager.get_instance();
                    offerManager.counterOffer(subscriber, store, offerId, counterPrice).then(_ => resolve('offer countered'))
                    .catch(err => reject('could not counter'))
                })
            .catch(error => reject(error))
        })
    }

    buyAcceptedOffer(sessionId: string, storeId: number, offerId: number): Promise<string> {
        let subscriber = this.logged_subscribers.get(sessionId);
        if(subscriber === undefined){
            return Promise.reject("subscriber is not logged in");
        }
        return new Promise((resolve, reject) =>
        {
            DB.getStoreByID(storeId)
            .then(store =>
                {
                    let offerManager = OfferManager.get_instance();
                    offerManager.buyAcceptedOffer(subscriber, store, offerId, () => {}).then(_ => resolve('offer countered'))
                    .catch(err => reject('could not counter'))
                })
            .catch(error => reject(error))
        })
    }

    public async setStoreToRecieveOffers(storeId: number): Promise<void> {
        return OfferManager.get_instance().setStoreToRecieveOffers(storeId);
    }

    public async setStoreToNotRecieveOffers(storeId: number): Promise<void> {
        return OfferManager.get_instance().setStoreToNotRecieveOffers(storeId);
    }

    public async isRecievingOffers(storeId: number): Promise<boolean> {
        return OfferManager.get_instance().isRecievingOffers(storeId);
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
    }

}