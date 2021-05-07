import FakeSystemFacade from "../DomainLayer/FakeSystemFacade";
import PaymentInfo from "../DomainLayer/purchase/PaymentInfo";
import Transaction from "../DomainLayer/purchase/Transaction";
import { Store } from "../DomainLayer/store/Store";
import { SystemFacade } from "../DomainLayer/SystemFacade";
import { Subscriber } from "../DomainLayer/user/Subscriber";
import { User } from "../DomainLayer/user/User";
import { isOk, makeFailure, makeOk, Result} from "../Result";

export class Service
{

    private static singletone: Service = undefined;
    private facade: SystemFacade;
    private send_message_func: (userId:number,message:{}) => Promise<number>; //TODO:change this signature according to future changes in Communication layer
  
    private constructor()
    {
        this.facade = new FakeSystemFacade().getFacade();
    }

    public get_word_list(word: string): string[]
    {
        return ['asd', 'bdsa', 'casd', 'ddsa'];
    }

    public set_send_func( send_func: (userId:number,message:{}) => Promise<number>) : void
    {
        Service.singletone.send_message_func = send_func;
    }

    public static get_instance() : Service
    {
        if (Service.singletone === undefined)
        {
            Service.singletone = new Service();
            Service.singletone.send_message_func= (userId : number, message:{}) => {throw 'send func not set yet'};
        }
        return Service.singletone;
    }

    //user enter the system
    public async enter(): Promise<number>
    {
        return this.facade.enter();
    }

    public exit(userId: number): void
    {
        this.facade.exit(userId)
    }

    public logout(userId: number): Promise<number>
    {
        return this.facade.logout(userId)
    }

    public async register(username: string, password: string, age: number): Promise<string>
    {
        return this.facade.register(username, password, age);
    }

    public async login(userId: number, username: string, password: string): Promise<Subscriber> 
    {
        return this.facade.login(userId, username, password);
    } 
    

    public getStoreInfo(userId : number ,storeId: number): Promise<string>
    {
        return this.facade.getStoreInfo(userId, storeId);
    }

    public getPruductInfoByName(userId : number, productName: string): Promise<string>
    {
        return this.facade.getPruductInfoByName(userId, productName);
    }

    public getPruductInfoByCategory(userId : number, category: string): Promise<string>
    {
        return this.facade.getPruductInfoByCategory(userId, category);
    }
    public addProductTocart(userId: number, storeId: number, productId: number, quantity: number): Promise<string>
    {
        return this.facade.addProductTocart(userId, storeId, productId, quantity);
    }

    public getCartInfo(userId: number): Promise<string>
    {
        return this.facade.getCartInfo(userId);
    }

    public editCart(userId: number , storeId : number , productId : number , newQuantity : number): Promise<string>
    {
        return this.facade.editCart(userId, storeId, productId, newQuantity);
    }

    public checkoutBasket(userId: number, shopId: number, supply_address: string ): Promise<boolean>
    {
        return this.facade.checkoutBasket(userId, shopId, supply_address);
    }

    public checkoutSingleProduct(userId : number, productId: number, quantity : number , storeId : number , supply_address: string): Promise<string>
    {
        return this.facade.checkoutSingleProduct(userId, productId, quantity, storeId, supply_address);
    }

    public completeOrder(userId : number , storeId : number , paymentInfo : PaymentInfo, userAddress: string) : Promise<boolean>
    {
        return this.facade.completeOrder(userId, storeId,paymentInfo, userAddress);
    }


    public async openStore(userId: number, storeName : string , bankAccountNumber : number ,storeAddress : string): Promise<Store>
    {
        return this.facade.openStore(userId, storeName, bankAccountNumber, storeAddress);
    }

    public editStoreInventory(userId: number, storeId: number, productId: number, quantity: number): Promise<string>
    {
        return this.facade.editStoreInventory(userId, storeId, productId, quantity);
    }

    public addNewProduct(userId: number, storeId: number, productName: string, categories: string[], price: number, quantity = 0): Promise<number>
    {
        return this.facade.addNewProduct(userId, storeId, productName, categories, price, quantity);
    }

    public getSubscriberPurchaseHistory(requestingUserId: number, subscriberToSeeId: number): Promise<any>
    {
        return this.facade.getSubscriberPurchaseHistory(requestingUserId, subscriberToSeeId);
    }

    //this function is used by subscribers that wants to see stores's history
    public getStorePurchaseHistory(userId: number, storeId: number): Promise<Transaction[]>
    {
        return this.facade.getStorePurchaseHistory(userId, storeId);
    }

    public deleteManagerFromStore(userId: number, managerToDelete: number, storeId: number): Promise<string>
    {
        return this.facade.deleteManagerFromStore(userId, managerToDelete, storeId);
    }

    public editStaffPermission(userId: number, managerToEditId: number, storeId: number, permissionMask: number):Promise<string>
    {
        return this.facade.editStaffPermission(userId, managerToEditId, storeId, permissionMask);
    }

    public appointStoreOwner(userId: number, storeId: number, newOwnerId: number): Promise<string>
    {
        return this.facade.appointStoreManager(userId, storeId, newOwnerId);
    }

    public appointStoreManager(userId: number, storeId: number, newManagerId: number): Promise<string>
    {
        return this.facade.appointStoreManager(userId, storeId, newManagerId);
    }

    public getStoreStaff(userId: number, storeId: number): Promise<string> {
        return this.facade.getStoreStaff(userId, storeId);
    }

    public getUsername(userId: number)
    {
        return this.facade.getUsername(userId);
    }

    public addDiscountPolicy(buyingPolicy: any)
    {
        throw new Error('Method not implemented.');
    }

    public addBuyingPolicy(buyingPolicy: any) {
        throw new Error('Method not implemented.');
    }

    public removeBuyingPolicy(discountNumber: number) {
        throw new Error('Method not implemented.');
    }

    public removeDiscountPolicy(discountPolicy: any) {
        throw new Error('Method not implemented.');
    }


    //------------------------------------------functions for tests-------------------------
    public get_logged_guest_users() : User[]
    {
        return this.facade.get_logged_guest_users();
    }

    public get_logged_subscribers() : User[]
    {
        return this.facade.get_logged_subscribers();
    }

    public get_logged_system_managers() : User[]
    {
        return this.facade.get_logged_subscribers();
    }

    public clear() : void
    {
        this.facade.clear();
    }

}