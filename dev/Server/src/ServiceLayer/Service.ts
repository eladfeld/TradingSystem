import { SHOULD_INIT_STATE } from "../../config";
import { tDiscount } from "../DomainLayer/discount/Discount";
import { tPredicate } from "../DomainLayer/discount/logic/Predicate";
import Transaction from "../DomainLayer/purchase/Transaction";
import { Store } from "../DomainLayer/store/Store";
import { SystemFacade } from "../DomainLayer/SystemFacade";
import { Subscriber } from "../DomainLayer/user/Subscriber";
import StateInitializer from './state/StateInitializer';
import {tPaymentInfo, tShippingInfo} from "../DomainLayer/purchase/Purchase";
import { tComplaint } from "../db_dummy/ComplaintsDBDummy";
import { login_stats } from "../DataAccessLayer/interfaces/iLoginStatsDB";
import { Offer } from "../DomainLayer/offer/Offer";
import { off } from "process";

export class Service
{


    private static singletone: Service = undefined;
    private facade: SystemFacade;

    private constructor()
    {
        this.facade = new SystemFacade();
    }

    public get_word_list(word: string): string[]
    {
        return ['asd', 'bdsa', 'casd', 'ddsa'];
    }

    public static async get_instance() : Promise<Service>
    {
        if (Service.singletone === undefined)
        {
            Service.singletone = new Service();
            return Service.singletone.facade.init().then(_ =>{
                if(SHOULD_INIT_STATE){
                    setTimeout(async() =>{
                        const res = await new StateInitializer().initState();
                        console.log(`init state was succesful: ${res}`)
                    }, 0);
                }
            }).then(() => Service.singletone)
        }
        return Service.singletone;
    }

    public complain = (sessionId:string, title:string, body:string):Promise<string> =>{
        return this.facade.complain(sessionId, title, body);
    }
    public getUsernames = (sessionId:string):Promise<string[]> =>{
        return this.facade.getUsernames(sessionId);
    }
    public getSystemComplaints = (sessionId:string):Promise<tComplaint[][]> => {
        return this.facade.getSystemComplaints(sessionId);
    }
    public deleteComplaint = (sessionId:string, messageId:number):Promise<string> =>{
        return this.facade.deleteComplaint(sessionId, messageId);
    }
    public replyToComplaint = (sessionId:string, title:string, body:string, messageId:number):Promise<string> =>{
        return this.facade.replyToComplaint(sessionId,title,body,messageId);
    }
    public closeStore = (sessionId:string, storeName:string):Promise<string> =>{
        return this.facade.closeStore(sessionId,storeName);
    }

    //returns a session id string
    public enter(): Promise<string>
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

    public register(username: string, password: string, age: number): Promise<string>
    {
        return this.facade.register(username, password, age);
    }

    public login(sessionId: string, username: string, password: string): Promise<Subscriber>
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

    public checkoutBasket(sessionId: string, shopId: number, shippingInfo: tShippingInfo ): Promise<boolean>
    {
        return this.facade.checkoutBasket(sessionId, shopId, shippingInfo);
    }

    public checkoutSingleProduct(sessionId : string, productId: number, quantity : number , storeId : number , shippingInfo:tShippingInfo): Promise<string>
    {
        return this.facade.checkoutSingleProduct(sessionId, productId, quantity, storeId, shippingInfo);
    }


    public completeOrder(sessionId : string , storeId : number , paymentInfo : tPaymentInfo, shippingInfo:tShippingInfo) : Promise<boolean>
    {
        return this.facade.completeOrder(sessionId, storeId,paymentInfo, shippingInfo);
    }


    public async openStore(sessionId: string, storeName : string , bankAccountNumber : number ,storeAddress : string): Promise<Store>
    {
        return this.facade.openStore(sessionId, storeName, bankAccountNumber, storeAddress);
    }

    public editStoreInventory(sessionId: string, storeId: number, productId: number, quantity: number): Promise<string>
    {
        return this.facade.editStoreInventory(sessionId, storeId, productId, quantity);
    }

    public addNewProduct(sessionId: string, storeId: number, productName: string, categories: string[], price: number, quantity = 0, image: string): Promise<number>
    {
        return this.facade.addNewProduct(sessionId, storeId, productName, categories, price, quantity, image);
    }

    public addCategory(sessionId: string, storeId: number, categoryFather:string, category: string): Promise<string>
    {
        return this.facade.addCategory(sessionId, storeId, categoryFather, category);
    }

    public addCategoryToRoot(sessionId: string, storeId: number, category: string): Promise<string>
    {
        return this.facade.addCategoryToRoot(sessionId, storeId, category);
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

    public deleteManagerFromStore(sessionId: string, managerToDelete: string, storeId: number): Promise<string>
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

    public addDiscountPolicy(sessionId: string, storeId: number, name: string, discount: tDiscount):Promise<string>
    {
        return this.facade.addDiscountPolicy(sessionId, storeId, name, discount);
    }

    public addBuyingPolicy(sessionId:string, storeId:number, policyName: string, buyingPolicy: tPredicate):Promise<string> {
        return this.facade.addBuyingPolicy(sessionId, storeId, policyName, buyingPolicy);
    }

    public removeBuyingPolicy(sessionId:string, storeId:number, policyNumber: number):Promise<string> {
        return this.facade.removeBuyingPolicy(sessionId, storeId, policyNumber);
    }

    // public getBuyingPolicies(sessionId: string, storeId: number):Promise<policyState[]> {
    //     return this.facade.getBuyingPolicies(sessiodId, storeId);
    // }

    public removeDiscountPolicy(sessionId:string, storeId:number, policyNumber: number):Promise<string> {
        return this.facade.removeDiscountPolicy(sessionId, storeId, policyNumber);
    }

    public getSubscriberId(sessionId: string): number
    {
        return this.facade.getSubscriberId(sessionId);
    }

    public getLoginStats(sessionId : string, from:Date, until:Date) : Promise<login_stats>
    {
        return this.facade.getLoginStats(sessionId , from, until);
    }

    public OfferResponseByOwner(sessionId: string, response: boolean, storeId: number, offerId: number): Promise<string>
    {
        return this.facade.OfferResponseByOwner(sessionId, response, storeId, offerId);
    }

    public getOffersByStore(storeId: number): Promise<Offer[]> {
        return this.facade.getOffersByStore(storeId);
    }

    public getOffersByUser(sessionId: string): Promise<Offer[]> {
        return this.facade.getOffersByUser(sessionId);
    }

    public newOffer(sessionId: string, storeId: number, productId: number, bid: number): Promise<string> {
        return this.facade.newOffer(sessionId, storeId, productId, bid);
    }

    public acceptOffer(sessionId: string, storeId: number, offerId: number): Promise<string> {
        return this.facade.acceptOffer(sessionId, storeId, offerId)
    }

    public declineOffer(sessionId: string, storeId: number, offerId: number): Promise<string> {
        return this.facade.declineOffer(sessionId, storeId, offerId)
    }

    public counterOffer(sessionId: string, storeId: number, offerId: number, counterPrice: number): Promise<string> {
        return this.facade.counterOffer(sessionId, storeId, offerId, counterPrice)
    }

    public buyAcceptedOffer(sessionId: string, storeId: number, offerId: number): Promise<string> {
        return this.facade.buyAcceptedOffer(sessionId, storeId, offerId)
    }

    public setStoreToRecieveOffers(storeId: number): Promise<void> {
        return this.facade.setStoreToRecieveOffers(storeId);
    }

    public setStoreToNotRecieveOffers(storeId: number): Promise<void> {
        return this.facade.setStoreToNotRecieveOffers(storeId);
    }

    public isRecievingOffers(storeId: number): Promise<boolean> {
        return this.facade.isRecievingOffers(storeId);
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

    public static uninitialize() : void
    {
        Service.singletone = undefined;
    }

}