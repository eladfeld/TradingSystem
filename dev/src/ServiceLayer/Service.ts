import { Logger } from "../DomainLayer/Logger";
import { Login } from "../DomainLayer/user/Login";
import { Register } from "../DomainLayer/user/Register";
import { Subscriber } from "../DomainLayer/user/Subscriber";
import { PaymentMeans, SupplyInfo, User } from "../DomainLayer/user/User";
import { isFailure, makeFailure, makeOk, Result } from "../Result";


export class Service
{
    private static singletone: Service = undefined;
    private logged_guest_users : User[];
    private logged_subscribers : Subscriber[];
    private logged_system_managers : Subscriber[];

    public static get_instance() : Service
    {
        if (Service.singletone === undefined)
        {
            Service.singletone = new Service();
            return Service.singletone;
        }
        return Service.singletone;
    }
    
    private constructor()
    {
        this.initPaymentSystem();
        this.initSupplySystem();
        this.initSystemManagers();
        this.logged_guest_users = [];
        this.logged_subscribers = [];
        this.logged_system_managers = [];
    }

    private initSupplySystem() : boolean
    {
        return true;
    }
    
    private initPaymentSystem() : boolean
    {
        return true;
    }
    
    private initSystemManagers() : boolean
    {
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
        Logger.log(`register : username:${username} , password:${password}`);
        return Register.register(username, password);
    }

    public login(userId: number, username: string, password: string): Result<number>
    {
        Logger.log(`login : userId:${userId} , username:${username} , password:${password}`);
        let res: Result<Subscriber> =  Login.login(username, password);
        if (isFailure(res))
        {
            return makeFailure(res.message);
        }
        let subscriber : Subscriber = res.value;
        this.logged_guest_users = this.logged_guest_users.map( user => user.getUserId() === userId ? subscriber : user);
        this.logged_subscribers.push(subscriber);
        if(subscriber.isSystemManager())
        {
            this.logged_system_managers.push(subscriber);
        }
        return makeOk(subscriber.getUserId());
    }

    public getStoreInfo(userId : number ,storeId: number): Result<string>
    {
        Logger.log(`getStoreInfo : userId:${userId} , storeId:${storeId}`);
        //TODO: forowrd to the stores system and return a json representation of the store
        return makeFailure("not yet implemented");
    }

    public getPruductInfo(userId : number): Result<string>
    {   
        Logger.log(`getPruductInfo : userId:${userId}`);
        //TODO: forowrd to the stores system and return a json representation of the store
        return makeFailure("not yet implemented");
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

    public buyBasket(userId: number, shopId: number, paymentMeans: PaymentMeans, supplyInfo: SupplyInfo ): Result<string>
    {
        Logger.log(`buyBasket : userId:${userId} , shopId:${shopId} , paymentMeans:${paymentMeans} , supplyInfo:${supplyInfo}`);
        let user: User = this.logged_guest_users.find(user => user.getUserId() === userId);
        if (user !== undefined)
            return user.buyBasket(shopId, paymentMeans, supplyInfo);
        return makeFailure("user not found");
    }

    public buyProduct(userId : number, productNumber: number, paymentMeans: PaymentMeans, supplyInfo: SupplyInfo): Result<string>
    {
        Logger.log(`buyProduct : userId:${userId} , productNumber:${productNumber} , paymentMeans:${paymentMeans} , supplyInfo:${supplyInfo}`);
        let user: User = this.logged_guest_users.find(user => user.getUserId() === userId);
        if (user !== undefined)
            return user.buyProduct(productNumber, paymentMeans, supplyInfo);
        return makeFailure("user not found");
    }

    //TODO: auction, offer and raffle kind of buying policies need extra functions @shir @alon to your concerns
    
    public openStore(userId: number, /*storeInfo: StoreInfo*/): Result<string>
    {
        Logger.log(`openStore : userId:${userId} , storeInfo:{storeInfo}`);
        let subscriber: Subscriber = this.logged_subscribers.find(sub => sub.getUserId() === userId);
        if(subscriber !== undefined)
        {
            //TODO: call store manager and open a store with #StoreInfo
        }
        return makeFailure("user not found");
    }

    //this function is used by the user himself
    //TODO: finish get purchase history in subscriber and remove comments
    public getPurchaseHistory(userId: number): Result<string>
    {
        Logger.log(`openStore : userId:${userId} , storeInfo:{storeInfo}`);
        let subscriber: Subscriber = this.logged_subscribers.find(sub => sub.getUserId() === userId);
        if(subscriber !== undefined)
        {
            /*return subscriber.getPurchaseHistory();  */
        }
        return makeFailure("user not found"); 
    }

    public editStoreInventory(userId: number, storeId: number, productId: number/* more params*/): Result<string>
    {
        //TODO: foroword to store module
        Logger.log(`editStoreInventory : userId:${userId} , storeId:${storeId}, productId:${productId}`);
        return makeFailure("not yet implemented");
    }

    //this function is used by system managers that wants to see someone's history
    public getSubscriberPurchaseHistory(userId: number, subscriberId: number): Result<string>
    {
        Logger.log(`getSubscriberPurchaseHistory : userId:${userId} , subscriberId:${subscriberId}`);
        let manager: Subscriber = this.logged_system_managers.find(user => user.getUserId() === userId);
        if (manager !== undefined)
            return this.getPurchaseHistory(subscriberId);
        return makeFailure("user don't have system manager permissions");
    }




    //------------------------------------------functions for tests-------------------------
    public getLoggedUsers() : User[] 
    {
        return this.logged_guest_users;
    }

    public clear() : void
    {
        this.logged_guest_users = [];
    }

}