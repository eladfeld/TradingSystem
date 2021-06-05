import PaymentSystemAdapter from './PaymentSystemAdapter';
import SupplySystemAdapter from './SupplySystemAdapter';

import Transaction, { TransactionStatus } from './Transaction';
import ShippingInfo from './ShippingInfo';
import { isFailure, makeFailure, makeOk, Result } from '../../Result';
import PaymentInfo from './PaymentInfo';
import { TIMEOUT } from 'dns';
import { Publisher } from '../notifications/Publisher';
import { userInfo } from 'os';
import { resolve } from 'path';
import { PurchaseDB } from '../../DataAccessLayer/DBinit';

export const stringUtil = {
    FAIL_RESERVE_MSG: "could not reserve shipment",
    FAIL_PAYMENT_TIMEOUT: "your current payment session has expired, please proceed back to checkout",
    FAIL_NO_TRANSACTION_IN_PROG :"user has no transaction in progress",
    FAIL_PAYMENT_REJECTED_PREFIX: "Your payment could be processed.",
    FAIL_FINALIZE_SHIPMENT: "We could not ship your items, you have been refunded, please try again later"
};
Object.freeze(stringUtil);

export const PAYMENT_TIMEOUT_MILLISEC: number = 100000;


class Purchase {

    private supplySystem: SupplySystemAdapter;
    private paymentSystem: PaymentSystemAdapter;
    private cartCheckoutTimers: Map<number,Map<number, [ReturnType<typeof setTimeout>, () => void]>>;
    //private dbDummy: PurchaseDB;


    constructor(){
        this.paymentSystem = new PaymentSystemAdapter();
        this.supplySystem = new SupplySystemAdapter();
        this.cartCheckoutTimers = new Map();
    }

    private resetTimer = (userId:number, storeId: number, callback: ()=>void)=>{
        const timerId = setTimeout(callback, PAYMENT_TIMEOUT_MILLISEC);
        this.addTimerAndCallback(userId, storeId, timerId, callback);
    }
    private terminateTransaction = (userId:number, storeId:number, storeCallback: () => void, status: number) => {
        const transactionp = PurchaseDB.getTransactionInProgress(userId, storeId);
        transactionp.then(transaction =>
            {
                if(!transaction) return;
                storeCallback();
                this.removeTimerAndCallback(userId, storeId);
                transaction.setStatus(status);
                PurchaseDB.updateTransaction(transaction);
            })

    }

    private onTransactionTimeout = (userId:number, storeId:number, storeCallback: () => void) => {
        this.terminateTransaction(userId, storeId, storeCallback, TransactionStatus.TIMED_OUT);
    }

    private onTransactionCancel = (userId:number, storeId:number, storeCallback: () => void) => {
        this.terminateTransaction(userId, storeId, storeCallback, TransactionStatus.CANCELLED);
    }

    public cancelTransactionInProgress = (userId:number, storeId: number) => {
        //TODO: handle exception
        if( !this.hasTransactionInProgress(userId,storeId)) return;
        const [timer, callback]: [ReturnType<typeof setTimeout>, () => void] = this.getTimerAndCallback(userId, storeId);
        this.onTransactionCancel(userId, storeId, callback);
    }
    public hasTransactionInProgress = (userId: number, storeId: number): boolean => {
        return this.getTimerAndCallback(userId, storeId)[0] !== undefined;
    }

    //initiates a transaction between the store and the user that will be completed within 5 minutes, otherwise cancelled.
    public checkout = (storeId: number, total: number, userId: number, 
        products: Map<number, [number,string,number]>, storeName: string ,onFail:()=>void):Result<boolean>=>{
        const transaction: Transaction = new Transaction(userId, storeId, products, total,storeName);
        const [oldTimerId, oldOnFail] = this.getTimerAndCallback(userId, storeId);
        if( oldTimerId !== undefined){
            //a checkout is already in progress, cancel the old timer/order
            clearTimeout(oldTimerId);
            this.onTransactionCancel(userId, storeId, oldOnFail);
        }

        //allow payment within 5 minutes
        PurchaseDB.storeTransaction(transaction);
        const timerId: ReturnType<typeof setTimeout> = setTimeout(() => {
            this.onTransactionTimeout(userId, storeId, onFail);
        }, PAYMENT_TIMEOUT_MILLISEC);
        this.addTimerAndCallback(userId, storeId, timerId, onFail);
        return makeOk(true);
    }

    //completes an existing transaction in progress. returns failure in the event that
    //1) no transaction is in progress, 2)Shipping issue 3) payment issue
    public CompleteOrder = (userId: number, storeId: number, shippingInfo: ShippingInfo, paymentInfo: PaymentInfo, storeBankAccount: number) : Promise<boolean> => {
        //verify transaction in progress
        const [oldTimerId, oldCallback] = this.getTimerAndCallback(userId, storeId);
        if( oldTimerId === undefined){
            //no checkout is in progress, cancel the old timer/order
            return Promise.reject("No checkout in progress");
        }
        clearTimeout(oldTimerId);
        const transactionp = PurchaseDB.getTransactionInProgress(userId, storeId);
        return new Promise((resolve,reject) => {
            transactionp.then( transaction => {
                //approve supply
                const shipmentId: number = this.supplySystem.reserve(shippingInfo);
                if(shipmentId < 0){
                    this.resetTimer(userId, storeId, oldCallback);
                    reject("could not ship items");
                }
                transaction.setShipmentId(shipmentId);
        
                //approve payment
                const paymentRes: Result<number> = this.paymentSystem.transfer(paymentInfo, storeBankAccount, transaction.getTotal());
                if(isFailure(paymentRes)){
                    this.supplySystem.cancelReservation(shipmentId);
                    this.resetTimer(userId, storeId, oldCallback);
                    reject(paymentRes.message);
                }
                else {
                    transaction.setPaymentId(paymentRes.value);
                    transaction.setCardNumber(paymentInfo.getCardNumber());
                    transaction.setStatus(TransactionStatus.COMPLETE);
                    PurchaseDB.updateTransaction(transaction);
                    this.removeTimerAndCallback(userId, storeId);
            
                    Publisher.get_instance().notify_store_update(storeId, `userid: ${transaction.getUserId()} bought from you with total of ${transaction.getTotal()}$`);
                    resolve(true);
                }
            })
            .catch(error => reject(error))
        })
        

    }

    
    private addTimerAndCallback = (userId: number, storeId: number, timerId: ReturnType<typeof setTimeout>, callback: ()=>void ):void => {
        if(this.cartCheckoutTimers.get(userId) === undefined){
            this.cartCheckoutTimers.set(userId, new Map());
        }
        this.cartCheckoutTimers.get(userId).set(storeId,[timerId,callback]);
    }

    private removeTimerAndCallback = (userId: number, storeId: number):void =>{
        try{
            const [timerId, cb] = this.getTimerAndCallback(userId,storeId);
            if(timerId === undefined) return;
            clearTimeout(timerId);
            this.cartCheckoutTimers.get(userId).delete(storeId);
        }catch(e){}
        return;
    }

    private getTimerAndCallback = (userId: number, storeId: number): [ReturnType<typeof setTimeout>, ()=>void] =>{
        try{
            const pair = this.cartCheckoutTimers.get(userId).get(storeId);
            if( pair !== undefined){
                return pair;
            }
        }catch(e){}
        return [undefined, undefined];
    } 


    public numTransactionsInProgress = (userId: number, storeId: number): Promise<number> => {
        const transactionsp = PurchaseDB.getTransactionsInProgress(userId,storeId);
        return new Promise((resolve,reject) => {
            transactionsp.then (transactions => {
                resolve(transactions.length)
            })
            .catch(error => reject(error))
        })        
    }

    public getAllTransactions = () => {
        return PurchaseDB.getAllTransactions();
    }
    public getTransactionInProgress = (userId: number, storeId: number): Promise<Transaction> =>{
        return PurchaseDB.getTransactionInProgress(userId, storeId);
    }

    public getCompletedTransactions = (userId: number, storeId: number): Promise<Transaction[]> => {
        let transp = PurchaseDB.getCompletedTransactions();
        return new Promise((resolve, reject) =>{
            transp.then(trans => resolve(trans.filter(t => ((t.getUserId()==userId) &&(t.getStoreId()==storeId)))))
            .catch(error => reject(error))
        })
    }
        

    public getCompletedTransactionsForUser = (userId: number): Promise<string> => {
        let transp = PurchaseDB.getCompletedTransactions();
        return new Promise((resolve, reject) =>{
            transp.then(trans => resolve(JSON.stringify(trans.filter(t => t.getUserId()==userId))))
        })
    }

    public getCompletedTransactionsForStore = (storeId: number): Promise<Transaction[]> =>{
        let transp = PurchaseDB.getCompletedTransactions();
        return new Promise((resolve, reject) =>{
            transp.then(trans => resolve(trans.filter(t => t.getStoreId()==storeId)))
            .catch(error => reject(error))
        })
    }

    public getAllTransactionsForUser = (userId: number): Promise<Transaction[]> =>{
        let transp = PurchaseDB.getCompletedTransactions();
        return new Promise((resolve, reject) =>{
            transp.then(trans => resolve(trans.filter(t => t.getUserId() === userId)))
            .catch(error => reject(error))
        })
    }
    
    public getFailedTransactions = ():Transaction[] => {
        return null;
    }
    
    public getUserStoreHistory = (userId: number, storeId: number): Promise<Transaction[]> =>{
        return PurchaseDB.getUserStoreHistory(userId, storeId);
    }
    public getPaymentTimeoutInMillis = ():number => {return PAYMENT_TIMEOUT_MILLISEC};

    public clear()
    {
        this.cartCheckoutTimers = new Map();
    }
}
const INSTANCE :Purchase = new Purchase();
export default INSTANCE;