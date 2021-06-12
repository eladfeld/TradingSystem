import { TEST_MODE } from "../../config";
import iDiscount from "../DomainLayer/discount/iDiscount";
import { Offer } from "../DomainLayer/offer/Offer";
import { Rule } from "../DomainLayer/policy/buying/BuyingPolicy";
import Transaction from "../DomainLayer/purchase/Transaction";
import { Store } from "../DomainLayer/store/Store";
import { StoreProduct } from "../DomainLayer/store/StoreProduct";
import { Appointment } from "../DomainLayer/user/Appointment";
import { Subscriber } from "../DomainLayer/user/Subscriber";
import { LoginStatsDB } from "./dbs/LoginStatsDB";
import { offerDB } from "./dbs/OfferDB";
import { productDB } from "./dbs/ProductDB";
import { purchaseDB } from "./dbs/PurchaseDB";
import { storeDB } from "./dbs/StoreDB";
import { subscriberDB } from "./dbs/SubscriberDB";
import { LoginStatsDummyDB } from "./dummies/LoginStatsDummyDB";
import { OfferDummyDB } from "./dummies/OfferDummyDB";
import { ProductDummyDB } from "./dummies/ProductDummyDB";
import { PurchaseDummyDB } from "./dummies/PurchaseDummyDB";
import { StoreDummyDB } from "./dummies/StoreDummyDB";
import { SubscriberDummyDB } from "./dummies/SubscriberDummyDb";
import { iLoginStatsDB, login_stats, userType } from "./interfaces/iLoginStatsDB";
import { iOfferDB } from "./interfaces/iOfferDB";
import { iProductDB } from "./interfaces/iProductDB";
import { iPurchaseDB } from "./interfaces/iPurchaseDB";
import { iStoreDB } from "./interfaces/iStoreDB";
import { iSubscriberDB } from "./interfaces/iSubscriberDB";

class DBfacade implements iLoginStatsDB,iProductDB,iPurchaseDB,iStoreDB, iSubscriberDB, iOfferDB
{
    private subscriberDB : iSubscriberDB;
    private loginDB : iLoginStatsDB;
    private productDB : iProductDB;
    private purchaseDB : iPurchaseDB;
    private storeDB : iStoreDB;
    private offerDB : iOfferDB;

    constructor(){
        if (TEST_MODE){
            this.subscriberDB = new SubscriberDummyDB();
            this.loginDB = new LoginStatsDummyDB();
            this.productDB = new ProductDummyDB();
            this.purchaseDB = new PurchaseDummyDB();
            this.storeDB = new StoreDummyDB();
            this.offerDB = new OfferDummyDB();
        }
        else
        {
            this.subscriberDB = new subscriberDB();
            this.loginDB = new LoginStatsDB();
            this.productDB = new productDB();
            this.purchaseDB = new purchaseDB();
            this.storeDB = new storeDB();
            this.offerDB = new offerDB();
        }
    }


    //-------------------------Subscriber DB-----------------------------
    public getAppointment(userId: number, storeId: number) : Promise<Appointment>{
        return this.subscriberDB.getAppointment(userId,storeId);
    }

    getLastUserId(): Promise<number> {
        return this.subscriberDB.getLastUserId()
    }
    public addMessageToHistory(message: string, userId: number):Promise<void>
    {
        return this.subscriberDB.addMessageToHistory(message, userId);
    }
    public addSubscriber(username: string, password: string, age: number):Promise<void>
    {
        return this.subscriberDB.addSubscriber(username, password, age);
    }

    public addSystemManager(subscriber: Subscriber):Promise<void>
    {
        return this.subscriberDB.addSystemManager(subscriber);
    }
    public isSystemManager(userId: number): Promise<boolean>
    {
        return this.subscriberDB.isSystemManager(userId);
    }
    public addProductToCart(subscriberId: number, storeId: number, productId: number, quantity: number):Promise<void>
    {
        return this.subscriberDB.addProductToCart(subscriberId, storeId, productId, quantity);
    }
    public updateCart(subscriberId: number, storeId: number, productId: number, newQuantity: number):Promise<void>
    {
        return this.subscriberDB.updateCart(subscriberId, storeId, productId, newQuantity);
    }
    public getSubscriberById(userId: number):Promise<Subscriber>
    {
        return this.subscriberDB.getSubscriberById(userId);
    }
    public getSubscriberByUsername(username: string):Promise<Subscriber>
    {
        return this.subscriberDB.getSubscriberByUsername(username);
    }
    public addAppointment(userId: number, appointment: Appointment):Promise<void>
    {
        return this.subscriberDB.addAppointment(userId, appointment);
    }
    public willFail():void
    {
        return this.subscriberDB.willFail();
    }
    public willSucceed(): void
    {
        return this.subscriberDB.willSucceed();
    }
    public deleteBasket(userId: number, storeId: number):Promise<void>
    {
        return this.subscriberDB.deleteBasket(userId, storeId);
    }
    public deleteAppointment(appointee: number, appointer: number, storeId: number):void
    {
        return this.subscriberDB.deleteAppointment(appointee, appointer, storeId);
    }
    public addPendingMessage(userId: number, message: string):void
    {
        return this.subscriberDB.addPendingMessage(userId, message);
    }
    public deletePendingMessages(userId: number):void
    {
        return this.subscriberDB.deletePendingMessages(userId);
    }
    public updatePermission(storeId: number, managerToEditId: number, permissionMask: number): Promise<void>
    {
        return this.subscriberDB.updatePermission(storeId, managerToEditId, permissionMask);
    }

    //-------------------------Store DB-----------------------------
    public addStore(store: Store): Promise<void>
    {
        return this.storeDB.addStore(store);
    }

    public getLastStoreId() : Promise<number>{
        return this.storeDB.getLastStoreId();
    }

    public getLastDiscountId() : Promise<number>{
        return this.storeDB.getLastBuyingId();
    }
    public getLastBuyingId() : Promise<number>{
        return this.storeDB.getLastBuyingId();
    }
    public getStoreByID(storeId: number) :Promise<Store>{
        return this.storeDB.getStoreByID(storeId);
    }

    public deleteStore(storeId: number) : Promise<void>{
        return this.storeDB.deleteStore(storeId);
    }

    public getStoreByName(storeName: string) : Promise<Store>{
        return this.storeDB.getStoreByName(storeName);
    }

    public getPruductInfoByName(productName: string) : Promise<string>{
        return this.storeDB.getPruductInfoByName(productName)
    }

    public getPruductInfoByCategory(category: string) : Promise<string>{
        return this.storeDB.getPruductInfoByCategory(category);
    }

    public getProductInfoAbovePrice(price: number) : Promise<string>{
        return this.storeDB.getProductInfoAbovePrice(price);
    }

    public getProductInfoBelowPrice(price: number): Promise<string>{
        return this.storeDB.getProductInfoBelowPrice(price);
    }

    public getPruductInfoByStore(storeName: string) : Promise<string>{
        return this.storeDB.getPruductInfoByStore(storeName);
    }

    public addCategory(StoreId: number, category: string, father: string) : Promise<void>{
        return this.storeDB.addCategory(StoreId, category, father)
    }
    public getCategoriesOfProduct(productId: number) : Promise<string[]>{
        return this.storeDB.getCategoriesOfProduct(productId);
    }

    public addCategoriesOfProduct(productId: number, category: string, storeId: number) : Promise<void>{
        return this.storeDB.addCategoriesOfProduct(productId, category, storeId);
    }

    public addPolicy(storeId: number, rule: Rule) : Promise<void>{
        return this.storeDB.addPolicy(storeId, rule);
    }

    public addDiscountPolicy(id: number, discount: iDiscount, storeId: number): Promise<void>{
        return this.storeDB.addDiscountPolicy(id, discount, storeId)
    }

    public updateStoreRecievesOffers(storeId: number, recieveOffers: boolean) : Promise<void>{
        return this.storeDB.updateStoreRecievesOffers(storeId, recieveOffers)
    }

    public getRecievingOffers(storeId: number) : Promise<boolean>{
        return this.storeDB.getRecievingOffers(storeId)
    }
    //-------------------------Transaction DB-----------------------------


    public completeTransaction(transaction: Transaction):Promise<boolean>
    {
        return this.purchaseDB.completeTransaction(transaction)
    }
    public getLastTransactionId(): Promise<number>
    {
        return this.purchaseDB.getLastTransactionId();
    }
    public getAllTransactions(): Promise<Transaction[]>
    {
        return this.purchaseDB.getAllTransactions();
    }
    public getCompletedTransactions():Promise<Transaction[]>
    {
        return this.purchaseDB.getCompletedTransactions()
    }
    public storeTransaction(transaction: Transaction):Promise<void>
    {
        return this.purchaseDB.storeTransaction(transaction);
    }
    public getTransactionInProgress(userId: number, storeId: number):Promise<Transaction>
    {
        return this.purchaseDB.getTransactionInProgress(userId, storeId);
    }
    public getTransactionsInProgress(userId: number, storeId: number): Promise<Transaction[]>
    {
        return this.purchaseDB.getTransactionsInProgress(userId, storeId);
    }
    public updateTransaction(transaction: Transaction):Promise<void>
    {
        return this.purchaseDB.updateTransaction(transaction)
    }
    public getUserStoreHistory(userId: number, storeId: number): Promise<Transaction[]>
    {
        return this.purchaseDB.getUserStoreHistory(userId, storeId);
    }

    //-------------------------Product DB-----------------------------
    public getLastProductId(): Promise<number>{
        return this.productDB.getLastProductId();
    }
    public addProduct(product: StoreProduct) : Promise<void>{
        return this.productDB.addProduct(product);
    }
    public getAllProductsOfStore(storeId: number) : Promise<StoreProduct[]>{
        return this.productDB.getAllProductsOfStore(storeId);
    }
    public getProductById(productId: number): Promise<StoreProduct>{
        return this.productDB.getProductById(productId)
    }
    public clear() :void{
        return this.productDB.clear()
    }



    //-------------------------LoginStats DB-----------------------------
    updateLoginStats(user_type: userType): Promise<void> {
        return this.loginDB.updateLoginStats(user_type);
    }
    setLoginStatsAtDate(date: Date, guests: number, subscribers: number, owners: number, managers: number, system_manager: number): Promise<void> {
       return this.loginDB.setLoginStatsAtDate(date, guests, subscribers, owners, managers, system_manager);
    }
    getLoginStats(from: Date, until: Date): Promise<login_stats> {
        return this.loginDB.getLoginStats(from,until);
    }

    //-------------------------Offer DB-----------------------------
    public async addOffer(offer: Offer): Promise<number>{
        return this.offerDB.addOffer(offer)
    }

    public async updateOffer(offer: Offer): Promise<void>{
        return this.offerDB.updateOffer(offer)
    }

    public async getOfferById(offerId: number): Promise<Offer>{
        return this.offerDB.getOfferById(offerId)
    }

    public async getAllOffersByStore(storeId: number): Promise<Offer[]>{
        return this.offerDB.getAllOffersByStore(storeId)
    }

    public async getAllOffersByUser(storeId: number): Promise<Offer[]>{
        return this.offerDB.getAllOffersByUser(storeId)
    }


}

export const DB =new DBfacade();