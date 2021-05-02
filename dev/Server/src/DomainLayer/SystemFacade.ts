import { Logger } from "../Logger";
import { Store } from "./store/Store";
import { Appointment } from "./user/Appointment";
import { Login } from "./user/Login";
import { Register } from "./user/Register";
import { Subscriber } from "./user/Subscriber";
import { PaymentMeans, SupplyInfo, User } from "./user/User";
import { isFailure, makeFailure, makeOk, Result } from "../Result";
import fs from 'fs';
import path from 'path'
import { buyingOption } from "./store/BuyingOption";
import { Authentication } from "./user/Authentication";
import { StoreDB } from "./store/StoreDB";
import Purchase from "./purchase/Purchase";
import { PaymentInfo } from "./purchase/PaymentInfo";
import Transaction from "./purchase/Transaction";
import { ProductDB } from "./store/ProductDB";
import { MakeAppointment } from "./user/MakeAppointment";
import { Publisher } from "./notifications/Publisher";

export class SystemFacade
{
    private logged_guest_users : User[];
    private logged_subscribers : Subscriber[];
    private logged_system_managers : Subscriber[];


    public constructor()
    {
        this.logged_guest_users = [];
        this.logged_subscribers = [];
        this.logged_system_managers = [];
        if(!(this.initPaymentSystem() && this.initSupplySystem() && this.initSystemManagers()))
        {
            Logger.error("system could not initialized properly!");
        }
    }

    private initSupplySystem() : boolean
    {
        return true;
    }

    private initPaymentSystem() : boolean
    {
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
            let sub: Subscriber = Subscriber.buildSubscriber(manager["username"], manager["hashpassword"] )
            Authentication.addSystemManager(sub);
        }
        return true
    }

    //user enter the system
    public enter(): Result<number>
    {
        Logger.log("new user entered the system");
        let user: User = new User();
        this.logged_guest_users.push(user);
        return makeOk(user.getUserId());
    }

    public exit(userId: number): void
    {
        Logger.log(`exit : userId:${userId}`);
        this.logged_guest_users = this.logged_guest_users.filter(user => user.getUserId() !== userId);
        this.logged_subscribers = this.logged_subscribers.filter(user => user.getUserId() !== userId);
        this.logged_system_managers = this.logged_system_managers.filter(user => user.getUserId() !== userId);

    }

    public logout(userId: number): Result<number>
    {
        Logger.log(`logout : userId:${userId}`);
        this.exit(userId);
        let user: User = new User();
        this.logged_guest_users.push(user);
        return makeOk(user.getUserId());
    }

    public register(username: string, password: string): Result<string>
    {
        Logger.log(`register : username:${username}`);
        return Register.register(username, password);
    }

    public login(userId: number, username: string, password: string): Result<Subscriber>
    {
        Logger.log(`login : userId:${userId} , username:${username}`);
        if(this.logged_guest_users.find(user => user.getUserId() === userId) === undefined)
        {
            return makeFailure("user didn't enter the system");
        }
        let res: Result<Subscriber> =  Login.login(username, password);
        if (isFailure(res))
        {
            return makeFailure(res.message);
        }
        let subscriber : Subscriber = res.value;
        Publisher.get_instance().send_pending_messages(subscriber);
        this.logged_guest_users = this.logged_guest_users.map( user => user.getUserId() === userId ? subscriber : user);
        this.logged_subscribers.push(subscriber);
        if(subscriber.isSystemManager())
        {
            this.logged_system_managers.push(subscriber);
        }
        return makeOk(subscriber);
    }

    public getStoreInfo(userId : number ,storeId: number): Result<string>
    {
        Logger.log(`getStoreInfo : userId:${userId} , storeId:${storeId}`);
        let store: Store = StoreDB.getStoreByID(storeId);
        return store.getStoreInfoResult(userId);
    }

    public getPruductInfoByName(userId : number, productName: string): Result<string>
    {
        Logger.log(`getPruductInfoByName : userId:${userId}, productName: ${productName}`);
        return StoreDB.getPruductInfoByName(productName);

    }

    public getPruductInfoByCategory(userId : number, category: string): Result<string>
    {
        Logger.log(`getPruductInfoByCategory : userId:${userId} , category:${category}`);
        return StoreDB.getPruductInfoByCategory(category);

    }

    public addProductTocart(userId: number, storeId: number, productId: number, quantity: number): Result<string>
    {
        Logger.log(`addProductTocart : userId:${userId} , storeId: ${storeId} , productId:${productId} , quantity: ${quantity}`);
        let user: User = this.logged_guest_users.find(user => user.getUserId() === userId);
        if (user !== undefined)
            return user.addProductToShoppingCart(storeId, productId, quantity);
        return makeFailure("user not found");
    }

    public getCartInfo(userId: number): Result<string>
    {
        Logger.log(`getCartInfo : userId:${userId}`);
        let user: User = this.logged_guest_users.find(user => user.getUserId() === userId);
        if (user !== undefined)
            return user.GetShoppingCart();
        return makeFailure("user not found");
    }

    public editCart(userId: number , storeId : number , productId : number , newQuantity : number): Result<string>
    {
        Logger.log(`editCart : userId:${userId} , storeId:${storeId} , productId:${productId} , newQuantity:${newQuantity}`);
        let user: User = this.logged_guest_users.find(user => user.getUserId() === userId);
        if (user !== undefined)
            return user.editCart(storeId , productId , newQuantity);
        return makeFailure("user not found");
    }

    public checkoutBasket(userId: number, shopId: number, supply_address: string ): Result<boolean>
    {
        Logger.log(`checkoutBasket : userId:${userId} , shopId:${shopId}  , supplyInfo:${supply_address}`);
        let user: User = this.logged_guest_users.find(user => user.getUserId() === userId);
        if (user !== undefined)
            return user.checkoutBasket(shopId, supply_address);
        return makeFailure("user not found");
    }

    public checkoutSingleProduct(userId : number, productId: number, quantity : number , storeId : number , supply_address: string): Result<string>
    {
        Logger.log(`checkoutSingleProduct : userId : ${userId}, productId: ${productId}, quantity :${quantity} , storeId : ${storeId},  , supplyInfo:${supply_address}`);
        let user: User = this.logged_guest_users.find(user => user.getUserId() === userId);
        if (user !== undefined)
            return user.checkoutSingleProduct(productId  , quantity,  supply_address, storeId , buyingOption.INSTANT);
        return makeFailure("user not found");
    }

    public completeOrder(userId : number , storeId : number , paymentInfo : PaymentInfo, userAddress: string) : Result<boolean>
    {
        Logger.log(`completeOrder: userId : ${userId}, storeId:${storeId}, paymentInfo:${paymentInfo}`);
        let user: User = this.logged_guest_users.find(user => user.getUserId() === userId);
        let store: Store = StoreDB.getStoreByID(storeId);
        if(user !== undefined)
        {
            return store.completeOrder(userId, paymentInfo, userAddress);
        }
        return makeFailure("user not found");
    }


    public openStore(userId: number, storeName : string , bankAccountNumber : number ,storeAddress : string): Result<Store>
    {
        Logger.log(`openStore : userId:${userId} , bankAccountNumber:${bankAccountNumber} , storeAddress:${storeAddress} `);
        let subscriber: Subscriber = this.logged_subscribers.find(sub => sub.getUserId() === userId);
        if(subscriber !== undefined)
        {
            let store: Store = new Store(subscriber.getUserId(), storeName, bankAccountNumber, storeAddress);
            MakeAppointment.appoint_founder(subscriber, store);
            return makeOk(store);
        }
        return makeFailure("user not found");
    }

    public editStoreInventory(userId: number, storeId: number, productId: number, quantity: number): Result<string>
    {
        Logger.log(`editStoreInventory : userId:${userId} , storeId:${storeId}, productId:${productId}, quantity:${quantity}`);
        let subscriber: Subscriber = this.logged_subscribers.find(subscriber => subscriber.getUserId() === userId);
        let store: Store = StoreDB.getStoreByID(storeId);
        if(subscriber !== undefined && store !== undefined)
        {
            return store.setProductQuantity(subscriber, productId, quantity);
        }
        return makeFailure("subscriber or store wasn't found");
    }

    public addNewProduct(userId: number, storeId: number, productName: string, categories: string[], price: number, quantity = 0): Result<number>
    {
        Logger.log(`addNewProduct : userId:${userId} , storeId:${storeId}, productName:${productName} , categories:${categories} , price:${price} , quantity:${quantity} `);
        let subscriber: Subscriber = this.logged_subscribers.find(subscriber => subscriber.getUserId() === userId);
        let store: Store = StoreDB.getStoreByID(storeId);
        if(subscriber !== undefined && store !== undefined)
        {
            return store.addNewProduct(subscriber, productName, categories, price, quantity);
        }
        return makeFailure("subscriber or store wasn't found");
    }

    public getSubscriberPurchaseHistory(requestingUserId: number, subscriberToSeeId: number): Result<any>
    {
        Logger.log(`getSubscriberPurchaseHistory : userId:${requestingUserId} , subscriberId:${subscriberToSeeId}`);
        let subscriber: Subscriber = this.logged_subscribers.find(user => user.getUserId() === requestingUserId);
        if (subscriber !== undefined)
            if (requestingUserId === subscriberToSeeId || Authentication.isSystemManager(requestingUserId))
                return makeOk(Purchase.getCompletedTransactionsForUser(subscriberToSeeId));
        return makeFailure("user don't have permissions");
    }

    //this function is used by subscribers that wants to see stores's history
    public getStorePurchaseHistory(userId: number, storeId: number): Result<Transaction[]>
    {
        Logger.log(`getStorePurchaseHistory : userId:${userId} ,storeId: ${storeId}`);
        let subscriber: Subscriber = this.logged_subscribers.find(user => user.getUserId() === userId);
        if (subscriber === undefined)
            return makeFailure("User not logged in")
        let store: Store = StoreDB.getStoreByID(storeId);
        if(!store.permittedToViewHistory(subscriber) && !Authentication.isSystemManager(userId) )
            return makeFailure("user don't have system manager permissions");
        return makeOk(Purchase.getCompletedTransactionsForStore(storeId));
    }

    public deleteManagerFromStore(userId: number, managerToDelete: number, storeId: number): Result<string>
    {
        Logger.log(`deleteManagerFromStore : userId:${userId},managerToDelete:${managerToDelete}, storeId:${storeId}`);
        let subscriber: Subscriber = this.logged_subscribers.find(subscriber => subscriber.getUserId() === userId);
        let store: Store = StoreDB.getStoreByID(storeId);
        if(subscriber !== undefined && store !== undefined)
        {
            return store.deleteManager(subscriber, managerToDelete );
        }
        return makeFailure("wrong parameter given");
    }

    public editStaffPermission(userId: number, managerToEditId: number, storeId: number, permissionMask: number):Result<string>
    {
        Logger.log(`editStaffPermission : userId:${userId},managerToEditId:${managerToEditId}, storeId:${storeId}, permissionMask:${permissionMask}`);
        let subscriber: Subscriber = this.logged_subscribers.find(subscriber => subscriber.getUserId() === userId);
        let store: Store = StoreDB.getStoreByID(storeId);
        if(subscriber !== undefined && store !== undefined)
        {
            return store.editStaffPermission(subscriber, managerToEditId, permissionMask);
        }
        return makeFailure("wrong parameter given");
    }

    public appointStoreOwner(userId: number, storeId: number, newOwnerId: number): Result<string>
    {
        Logger.log(`appointStoreOwner : userId:${userId} , storeId:${storeId}, newOwnerId:${newOwnerId}`);
        let appointer: Subscriber = this.logged_subscribers.find(subscriber => subscriber.getUserId() === userId);
        let store: Store = StoreDB.getStoreByID(storeId);
        return store.appointStoreOwner(appointer, Authentication.getSubscriberById(newOwnerId))
    }

    public appointStoreManager(userId: number, storeId: number, newManagerId: number): Result<string>
    {
        Logger.log(`appointStoreManager : userId:${userId} , storeId:${storeId}, newManagerId:${newManagerId}`);
        let appointer: Subscriber = this.logged_subscribers.find(subscriber => subscriber.getUserId() === userId);
        let store: Store = StoreDB.getStoreByID(storeId);
        return store.appointStoreManager(appointer, Authentication.getSubscriberById(newManagerId))
    }

    public getStoreStaff(userId: number, storeId: number): Result<string> {
        Logger.log(`getStoreStaff : userId:${userId} , storeId:${storeId}`);
        let subscriber: Subscriber = this.logged_subscribers.find(subscriber => subscriber.getUserId() === userId);
        let store: Store = StoreDB.getStoreByID(storeId);
        return store.getStoreStaff(subscriber)
    }


    //------------------------------------------functions for tests-------------------------
    public get_logged_guest_users() : User[]
    {
        return this.logged_guest_users;
    }

    public get_logged_subscribers() : User[]
    {
        return this.logged_subscribers;
    }

    public get_logged_system_managers() : User[]
    {
        return this.logged_system_managers;
    }

    public clear() : void
    {
        this.logged_guest_users = [];
        this.logged_subscribers = [];
        this.logged_system_managers = [];
        Authentication.clean();
        StoreDB.clear();
        ProductDB.clear();
    }

}