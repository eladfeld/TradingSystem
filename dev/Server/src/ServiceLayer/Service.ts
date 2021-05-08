import FakeSystemFacade from "../DomainLayer/FakeSystemFacade";
import { Publisher } from "../DomainLayer/notifications/Publisher";
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
    private send_message_func: (userId:number, message:string) => Promise<string>; //TODO:change this signature according to future changes in Communication layer

    private constructor()
    {
        this.facade = new FakeSystemFacade().getFacade();
    }

    public get_word_list(word: string): string[]
    {
        return ['asd', 'bdsa', 'casd', 'ddsa'];
    }

    public set_send_func( send_func: (userId:number,message:string) => Promise<string>) : void
    {
        Service.singletone.send_message_func = send_func;
        Publisher.get_instance().set_send_func(send_func);
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
    public async enter(): Promise<string>
    {
        return this.facade.enter();
    }

    public exit(sessionId: string): void
    {
        this.facade.exit(sessionId)
    }

    public logout(sessionId: string): Promise<string>
    {
        return this.facade.logout(sessionId)
    }

    public async register(username: string, password: string, age: number): Promise<string>
    {
        return this.facade.register(username, password, age);
    }

    public async login(sessionId: string, username: string, password: string): Promise<Subscriber>
    {
        return this.facade.login(sessionId, username, password);
    }


    public getStoreInfo(sessionId : string ,storeId: number): Promise<string>
    {
        return this.facade.getStoreInfo(sessionId, storeId);
    }

    public getPruductInfoByName(sessionId : string, productName: string): Promise<string>
    {
        return this.facade.getPruductInfoByName(sessionId, productName);
    }

    public getPruductInfoByCategory(sessionId : string, category: string): Promise<string>
    {
        return this.facade.getPruductInfoByCategory(sessionId, category);
    }

    public getPruductInfoAbovePrice(userId : number, price: number): Promise<string>
    {
        return this.facade.getPruductInfoAbovePrice(userId, price);
    }

    public getPruductInfoBelowPrice(userId : number, price: number): Promise<string>
    {
        return this.facade.getPruductInfoBelowPrice(userId, price);
    }

    public getPruductInfoByStore(userId : number, store: string): Promise<string>
    {
        return this.facade.getPruductInfoByStore(userId, store);
    }

    public addProductTocart(sessionId: string, storeId: number, productId: number, quantity: number): Promise<string>
    {
        return this.facade.addProductTocart(sessionId, storeId, productId, quantity);
    }

    public getCartInfo(sessionId: string): Promise<string>
    {
        return this.facade.getCartInfo(sessionId);
    }

    public editCart(sessionId: string , storeId : number , productId : number , newQuantity : number): Promise<string>
    {
        return this.facade.editCart(sessionId, storeId, productId, newQuantity);
    }

    public checkoutBasket(sessionId: string, shopId: number, supply_address: string ): Promise<boolean>
    {
        return this.facade.checkoutBasket(sessionId, shopId, supply_address);
    }

    public checkoutSingleProduct(sessionId : string, productId: number, quantity : number , storeId : number , supply_address: string): Promise<string>
    {
        return this.facade.checkoutSingleProduct(sessionId, productId, quantity, storeId, supply_address);
    }

    public completeOrder(sessionId : string , storeId : number , paymentInfo : PaymentInfo, userAddress: string) : Promise<boolean>
    {
        return this.facade.completeOrder(sessionId, storeId,paymentInfo, userAddress);
    }


    public async openStore(sessionId: string, storeName : string , bankAccountNumber : number ,storeAddress : string): Promise<Store>
    {
        return this.facade.openStore(sessionId, storeName, bankAccountNumber, storeAddress);
    }

    public editStoreInventory(sessionId: string, storeId: number, productId: number, quantity: number): Promise<string>
    {
        return this.facade.editStoreInventory(sessionId, storeId, productId, quantity);
    }

    public addNewProduct(sessionId: string, storeId: number, productName: string, categories: string[], price: number, quantity = 0): Promise<number>
    {
        return this.facade.addNewProduct(sessionId, storeId, productName, categories, price, quantity);
    }

    public getSubscriberPurchaseHistory(sessionId: string, subscriberToSeeId: number): Promise<any>
    {
        return this.facade.getSubscriberPurchaseHistory(sessionId, subscriberToSeeId);
    }

    public getMyPurchaseHistory(sessionId: string): Promise<any>
    {
        return this.facade.getMyPurchaseHistory(sessionId);
    }

    //this function is used by subscribers that wants to see stores's history
    public getStorePurchaseHistory(sessionId: string, storeId: number): Promise<Transaction[]>
    {
        return this.facade.getStorePurchaseHistory(sessionId, storeId);
    }

    public deleteManagerFromStore(sessionId: string, managerToDelete: number, storeId: number): Promise<string>
    {
        return this.facade.deleteManagerFromStore(sessionId, managerToDelete, storeId);
    }

    public editStaffPermission(sessionId: string, managerToEditId: number, storeId: number, permissionMask: number):Promise<string>
    {
        return this.facade.editStaffPermission(sessionId, managerToEditId, storeId, permissionMask);
    }

    public appointStoreOwner(sessionId: string, storeId: number, newOwnerUsername: string): Promise<string>
    {
        return this.facade.appointStoreOwner(sessionId, storeId, newOwnerUsername);
    }

    public appointStoreManager(sessionId: string, storeId: number, newManagerUsername: string): Promise<string>
    {
        return this.facade.appointStoreManager(sessionId, storeId, newManagerUsername);
    }

    public getStoreStaff(sessionId: string, storeId: number): Promise<string> {
        return this.facade.getStoreStaff(sessionId, storeId);
    }

    public getUsername(sessionId: string)
    {
        return this.facade.getUsername(sessionId);
    }

    public getUserStores(sessionId : string){
        return this.facade.getUserStores(sessionId);
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

    public getSubscriberId(sessionId: string): number
    {
        return this.facade.getSubscriberId(sessionId);
    }


    //------------------------------------------functions for tests-------------------------
    public get_logged_guest_users()
    {
        return this.facade.get_logged_guest_users();
    }

    public get_logged_subscribers()
    {
        return this.facade.get_logged_subscribers();
    }

    public get_logged_system_managers()
    {
        return this.facade.get_logged_subscribers();
    }

    public clear() : void
    {
        this.facade.clear();
    }

}