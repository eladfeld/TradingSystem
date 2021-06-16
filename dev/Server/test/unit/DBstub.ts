import { iLoginStatsDB, login_stats, userType } from "../../src/DataAccessLayer/interfaces/iLoginStatsDB";
import { iProductDB } from "../../src/DataAccessLayer/interfaces/iProductDB";
import { iPurchaseDB } from "../../src/DataAccessLayer/interfaces/iPurchaseDB";
import { iStoreDB } from "../../src/DataAccessLayer/interfaces/iStoreDB";
import { iSubscriberDB } from "../../src/DataAccessLayer/interfaces/iSubscriberDB";
import iDiscount from "../../src/DomainLayer/discount/iDiscount";
import { Rule } from "../../src/DomainLayer/policy/buying/BuyingPolicy";
import Transaction from "../../src/DomainLayer/purchase/Transaction";
import { Store } from "../../src/DomainLayer/store/Store";
import { StoreProduct } from "../../src/DomainLayer/store/StoreProduct";
import { Appointment } from "../../src/DomainLayer/user/Appointment";
import { Subscriber } from "../../src/DomainLayer/user/Subscriber";

export class DBstub implements iLoginStatsDB,iProductDB,iPurchaseDB,iStoreDB, iSubscriberDB 
{
    updateProduct (product: StoreProduct) : Promise<void>{
        return Promise.resolve()
    }
    getRecievingOffers (storeId: number) :Promise<boolean>{
        return Promise.resolve(true)
    }
    updateStoreRecievesOffers(storeId: number, recieveOffers: boolean) : Promise<void>{
        return Promise.resolve()
    }
    getLastUserId(): Promise<number> {
        return Promise.resolve(1)
    }

    addMessageToHistory(message: string, userId: number) :Promise<void>{
        return Promise.resolve()
    }

    addSubscriber(username: string, password: string, age: number):Promise<void>{
        return Promise.resolve()
    }
    addSystemManager(subscriber: Subscriber): Promise<void>{
        return Promise.resolve()
    }
    isSystemManager(userId: number) : Promise<boolean>{ return Promise.resolve(true)}
    addProductToCart(subscriberId: number, storeId: number, productId: number, quantity: number) : Promise<void>{ 
        return Promise.resolve()}
    updateCart(subscriberId: number, storeId: number, productId: number, newQuantity: number) : Promise<void>{ return Promise.resolve()}
    getSubscriberById(userId: number) : Promise<Subscriber>{ return Promise.resolve(undefined)}
    getSubscriberByUsername(username: string) : Promise<Subscriber>{ return Promise.resolve(undefined)}
    addAppointment (userId: number, appointment: Appointment) : Promise<void>{return Promise.resolve()}
    getAppointment(userId: number, storeId: number) : Promise<Appointment>{return Promise.resolve(undefined)}
    deleteBasket(userId: number, storeId: number) : Promise<void>{return Promise.resolve()}
    deleteAppointment(appointee: number, appointer: number, storeId: number) : void{}
    addPendingMessage(userId: number, message: string) : void{}
    deletePendingMessages (userId: number) : void{}
    updatePermission (storeId: number, managerToEditId: number, permissionMask: number) : Promise<void>{return Promise.resolve()}
    addStore (store: Store) : Promise<void>{return Promise.resolve()}
    getLastStoreId () : Promise<number>{return Promise.resolve(1)}
    getLastDiscountId () : Promise<number>{return Promise.resolve(1)}
    getLastBuyingId () : Promise<number>{return Promise.resolve(1)}
    getStoreByID (storeId: number) : Promise<Store>{return Promise.resolve(undefined)}
    deleteStore (storeId: number) : Promise<void>{return Promise.resolve(undefined)}
    getStoreByName (storeName: string) : Promise<Store>{return Promise.resolve(undefined)}
    getPruductInfoByName (productName: string) : Promise<string>{return Promise.resolve(undefined)}
    getPruductInfoByCategory (category: string) : Promise<string>{return Promise.resolve(undefined)}
    getProductInfoAbovePrice (price: number) : Promise<string>{return Promise.resolve(undefined)}
    getProductInfoBelowPrice (price: number) : Promise<string>{return Promise.resolve(undefined)}
    getPruductInfoByStore (storeName: string) : Promise<string>{return Promise.resolve(undefined)}
    addCategory (StoreId: number, category: string, father: string) : Promise<void>{return Promise.resolve(undefined)}
    getCategoriesOfProduct (productId: number) : Promise<string[]>{return Promise.resolve(undefined)}
    addCategoriesOfProduct (productId: number, category: string, storeId: number) : Promise<void>{return Promise.resolve(undefined)}
    addPolicy (storeId: number, rule: Rule) : Promise<void>{return Promise.resolve(undefined)}
    addDiscountPolicy (id: number, discount: iDiscount, storeId: number) : Promise<void>{return Promise.resolve(undefined)}
    completeTransaction (transaction: Transaction) : Promise<boolean>{return Promise.resolve(undefined)}
    getLastTransactionId () : Promise<number>{return Promise.resolve(undefined)}
    getAllTransactions () : Promise<Transaction[]>{return Promise.resolve(undefined)}
    getCompletedTransactions () : Promise<Transaction[]>{return Promise.resolve(undefined)}
    storeTransaction (transaction: Transaction) : Promise<void>{return Promise.resolve(undefined)}
    getTransactionInProgress (userId: number, storeId: number) : Promise<Transaction>{return Promise.resolve(undefined)}
    getTransactionsInProgress (userId: number, storeId: number) : Promise<Transaction[]>{return Promise.resolve(undefined)}
    updateTransaction (transaction: Transaction) : Promise<void>{return Promise.resolve(undefined)}
    getUserStoreHistory (userId: number, storeId: number) : Promise<Transaction[]>{return Promise.resolve(undefined)}
    getLastProductId () : Promise<number>{return Promise.resolve(undefined)}
    addProduct (product: StoreProduct) : Promise<void>{return Promise.resolve(undefined)}
    getAllProductsOfStore (storeId: number) : Promise<StoreProduct[]>{return Promise.resolve(undefined)}
    getProductById (productId: number) : Promise<StoreProduct>{return Promise.resolve(undefined)}
    clear:() => void; 
    updateLoginStats(user_type: userType): Promise<void> {
        return Promise.resolve(undefined)
    }
    setLoginStatsAtDate(date: Date, guests: number, subscribers: number, owners: number, managers: number, system_manager: number): Promise<void> {
        return Promise.resolve(undefined)
    }
    getLoginStats(from: Date, until: Date): Promise<login_stats> {
        return Promise.resolve(undefined)
    }
    willFail() : void{}
    willSucceed() : void{}
}