import PaymentSystemAdapter from './PaymentSystemAdapter';
import SupplySystemAdapter from './SupplySystemAdapter';

import Transaction, { TransactionStatus } from './Transaction';
import DbDummy from './DbDummy';
import ShippingInfo from './ShippingInfo';
import { isFailure, makeFailure, makeOk, Result } from '../../Result';
import { TIMEOUT } from 'dns';
import { Publisher } from '../notifications/Publisher';
import { userInfo } from 'os';
import { rejects } from 'assert';
import { resolve } from 'path';

export const stringUtil = {
    FAIL_RESERVE_MSG: "could not reserve shipment",
    FAIL_PAYMENT_TIMEOUT: "your current payment session has expired, please proceed back to checkout",
    FAIL_NO_TRANSACTION_IN_PROG :"user has no transaction in progress",
    FAIL_PAYMENT_REJECTED_PREFIX: "Your payment could be processed.",
    FAIL_FINALIZE_SHIPMENT: "We could not ship your items, you have been refunded, please try again later"
};
Object.freeze(stringUtil);
export type tShippingInfo = {name: string, address: string, city:string, country:string , zip:number};
export type tPaymentInfo = {holder:string, id:number, cardNumber:number, expMonth:number, expYear:number, cvv:number, toAccount: number, amount: number};

export const PAYMENT_TIMEOUT_MILLISEC: number = 100000;


class Purchase {

    private supplySystem: SupplySystemAdapter;
    private paymentSystem: PaymentSystemAdapter;
    private cartCheckoutTimers: Map<number,Map<number, [ReturnType<typeof setTimeout>, () => void]>>;
    private dbDummy: DbDummy;


    constructor(){
        this.paymentSystem = new PaymentSystemAdapter();
        this.supplySystem = new SupplySystemAdapter();
        this.cartCheckoutTimers = new Map();
        this.dbDummy = new DbDummy();
    }

    private resetTimer = (userId:number, storeId: number, callback: ()=>void)=>{
        const timerId = setTimeout(callback, PAYMENT_TIMEOUT_MILLISEC);
        this.addTimerAndCallback(userId, storeId, timerId, callback);
    }
    private terminateTransaction = (userId:number, storeId:number, storeCallback: () => void, status: number) => {
        const transaction: Transaction = this.dbDummy.getTransactionInProgress(userId, storeId);
        if(!transaction) return;
        storeCallback();
        this.removeTimerAndCallback(userId, storeId);
        transaction.setStatus(status);
        this.dbDummy.updateTransaction(transaction);
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
        products: Map<number, number>, storeName: string ,onFail:()=>void):Result<boolean>=>{
        const transaction: Transaction = new Transaction(userId, storeId, products, total,storeName);
        const [oldTimerId, oldOnFail] = this.getTimerAndCallback(userId, storeId);
        if( oldTimerId !== undefined){
            //a checkout is already in progress, cancel the old timer/order
            clearTimeout(oldTimerId);
            this.onTransactionCancel(userId, storeId, oldOnFail);
        }

        //allow payment within 5 minutes
        this.dbDummy.storeTransaction(transaction);
        const timerId: ReturnType<typeof setTimeout> = setTimeout(() => {
            this.onTransactionTimeout(userId, storeId, onFail);
        }, PAYMENT_TIMEOUT_MILLISEC);
        this.addTimerAndCallback(userId, storeId, timerId, onFail);
        return makeOk(true);
    }

    //completes an existing transaction in progress. returns failure in the event that
    //1) no transaction is in progress, 2)Shipping issue 3) payment issue
    public CompleteOrder = async (userId: number, storeId: number, shippingInfo: tShippingInfo, paymentInfo: tPaymentInfo, storeBankAccount: number) : Promise<boolean> => {
        //verify transaction in progress
        const [oldTimerId, oldCallback] = this.getTimerAndCallback(userId, storeId);
        if( oldTimerId === undefined){
            //no checkout is in progress, cancel the old timer/order
            return new Promise((res , rej) => {rej("No checkout in progress")});
        }
        clearTimeout(oldTimerId);
        const transaction: Transaction = this.dbDummy.getTransactionInProgress(userId, storeId);
        //approve supply
        const shipmentId: number = await this.supplySystem.supply(shippingInfo);
        if(shipmentId < 0){
            this.resetTimer(userId, storeId, oldCallback);
            return new Promise((res , rej) => {rej("could not ship items")});
        }
        transaction.setShipmentId(shipmentId);
        //approve payment
        const paymentRes: number = await this.paymentSystem.transfer(paymentInfo);
        if(paymentRes < 0){
            this.supplySystem.cancelSupply(shipmentId);
            this.resetTimer(userId, storeId, oldCallback);
            return new Promise((res , rej) => {rej("unable to complete money transfer")});
        }
        
        transaction.setPaymentId(paymentRes);
        transaction.setCardNumber(paymentInfo.cardNumber);
        transaction.setStatus(TransactionStatus.COMPLETE);
        this.dbDummy.updateTransaction(transaction);
        this.removeTimerAndCallback(userId, storeId);

        Publisher.get_instance().notify_store_update(storeId, `userid: ${transaction.getUserId()} bought from you with total of ${transaction.getTotal()}$`);
        return new Promise((res , rej) => {res(true)});
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


    public numTransactionsInProgress = (userId: number, storeId: number): number => {
        const transactions: Transaction[] = this.dbDummy.getTransactionsInProgress(userId,storeId);
        return transactions.length;
    }

    public getAllTransactions = () => {
        return this.dbDummy.getAllTransactions();
    }
    public getTransactionInProgress = (userId: number, storeId: number): Transaction =>{
        return this.dbDummy.getTransactionInProgress(userId, storeId);
    }

    public getCompletedTransactions = (userId: number, storeId: number): Transaction[] => {
        return this.dbDummy.getCompletedTransactions().filter(t => ((t.getUserId()==userId) &&(t.getStoreId()==storeId)));
    }

    public getCompletedTransactionsForUser = (userId: number): string => {
        return JSON.stringify(this.dbDummy.getCompletedTransactions().filter(t => t.getUserId()==userId));
    }
    public getCompletedTransactionsForStore = (storeId: number): Transaction[] =>{
        return this.dbDummy.getCompletedTransactions().filter(t => t.getStoreId()==storeId);
    }

    public getAllTransactionsForUser = (userId: number): Transaction[] =>{
        return this.dbDummy.getAllTransactions().filter(t => t.getUserId() === userId);
    }
    public getFailedTransactions = ():Transaction[] => {
        return null;
    }
    public getUserStoreHistory = (userId: number, storeId: number):Transaction[] =>{
        return this.dbDummy.getUserStoreHistory(userId, storeId);
    }
    public getPaymentTimeoutInMillis = ():number => {return PAYMENT_TIMEOUT_MILLISEC};

    public clear()
    {
        this.cartCheckoutTimers = new Map();
        this.dbDummy = new DbDummy();
    }
}
const INSTANCE :Purchase = new Purchase();
export default INSTANCE;