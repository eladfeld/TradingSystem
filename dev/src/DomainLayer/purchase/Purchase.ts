import PaymentSystemAdapter from './PaymentSystemAdapter';
import SupplySystemAdapter from './SupplySystemAdapter';

import Transaction, { TransactionStatus } from './Transaction';
import DbDummy from './DbDummy';
import { Store } from '../store/Store';
import ShippingInfo from './ShippingInfo';
import { isFailure, makeFailure, makeOk, Result } from '../../Result';
import { PaymentInfo } from './PaymentInfo';

export const stringUtil = {
    FAIL_RESERVE_MSG: "could not reserve shipment",
    FAIL_PAYMENT_TIMEOUT: "your current payment session has expired, please proceed back to checkout",
    FAIL_NO_TRANSACTION_IN_PROG :"user has no transaction in progress",
    FAIL_PAYMENT_REJECTED_PREFIX: "Your payment could be processed.",
    FAIL_FINALIZE_SHIPMENT: "We could not ship your items, you have been refunded, please try again later"
};
Object.freeze(stringUtil);

const PAYMENT_TIMEOUT_MILLISEC: number = 300000;

class Purchase {

    private supplySystem: SupplySystemAdapter;
    private paymentSystem: PaymentSystemAdapter;
    private cartCheckoutTimers: Map<number,Map<number, [ReturnType<typeof setTimeout>, Map<number,number>]>>;
    private dbDummy: DbDummy;


    constructor(){
        this.paymentSystem = new PaymentSystemAdapter();
        this.supplySystem = new SupplySystemAdapter();
        this.cartCheckoutTimers = new Map();
        this.dbDummy = new DbDummy();
    }

    checkout = (store: Store, total: number, userId: number, products: Map<number, number>, shipAdrs: string):Result<boolean>=>{
        const storeId: number = store.getStoreId();
        const transaction: Transaction = new Transaction(userId, storeId, products, total);
        const shippingInfo: ShippingInfo = new ShippingInfo(userId,storeId, shipAdrs, store.getStoreAddress());

        const [oldTimerId, oldCart] = this.getTimerAndCart(userId, storeId);
        if( oldTimerId !== undefined){
            //a checkout is already in progress, cancel the old timer/order
            clearTimeout(oldTimerId);
            this.cancelTransaction(userId,store, oldCart);
        }

        const shipmentId:number = this.supplySystem.reserve(shippingInfo);        
        if(shipmentId < 0 ){
            //could not reserve shipping
            transaction.setStatus(TransactionStatus.FAIL_RESERVE);
            this.dbDummy.storeTransactionInProgress(transaction);
            return makeFailure(stringUtil.FAIL_RESERVE_MSG);
        }
        //allow payment within 5 minutes
        transaction.setStatus(TransactionStatus.ITEMS_RESERVED);
        transaction.setShipmentId(shipmentId);
        this.dbDummy.storeTransactionInProgress(transaction);
        const timerId: ReturnType<typeof setTimeout> = setTimeout(() => {
            this.cancelTransaction(userId,store, oldCart);
            this.supplySystem.cancelReservation(shipmentId);
        }, PAYMENT_TIMEOUT_MILLISEC);
        this.addTimerAndCart(userId, storeId, timerId, products);
        return makeOk(true);
    }


    CompleteOrder = (userId: number, storeId: number, paymentInfo: PaymentInfo) : Result<boolean> => {
        const transaction: Transaction = this.dbDummy.getTransactionInProgress(userId, storeId); 
        if(!transaction){
            return makeFailure(stringUtil.FAIL_NO_TRANSACTION_IN_PROG);//nothing reserved
        } 
        
        const [timerId, oldCart] = this.getTimerAndCart(userId, storeId);
        if(timerId === undefined){
            return makeFailure(stringUtil.FAIL_PAYMENT_TIMEOUT);//times up!!
        }
        const paymentRes: Result<number> = undefined //this.paymentSystem.transfer(paymentInfo, storeAccount, transaction.getTotal());       
        if(isFailure(paymentRes)){
            return makeFailure(stringUtil.FAIL_PAYMENT_REJECTED_PREFIX+'\n'+paymentRes.message);
        }

        clearTimeout(timerId);  
        this.removeTimerAndCart(userId,storeId);

        const paymentId: number = paymentRes.value
        transaction.setStatus(TransactionStatus.PAID);
        const isShipped: boolean = this.supplySystem.supply(transaction.getShipmentId());
        if(!isShipped){
            this.paymentSystem.refund(paymentId);//TODO: verify refunds
            return makeFailure(stringUtil.FAIL_FINALIZE_SHIPMENT);
        }
        transaction.setStatus(TransactionStatus.SUPPLIED);
        this.dbDummy.storeCompletedTransaction(transaction);
        this.dbDummy.removeTransactionInProgress(userId, storeId);
        return makeOk(true);        
    }

    cancelTransaction = (userId:number, store:Store, oldCart:Map<number,number>) => {
        //store.cancelReservedShoppingBasket(oldCart);
        this.removeTimerAndCart(userId,store.getStoreId());
        this.dbDummy.removeTransactionInProgress(userId, store.getStoreId());
    }
    
    addTimerAndCart = (userId: number, storeId: number, timerId: ReturnType<typeof setTimeout>, products: Map<number,number> ):void => {
        if(this.cartCheckoutTimers.get(userId) === undefined){
            this.cartCheckoutTimers.set(userId, new Map());
        }
        this.cartCheckoutTimers.get(userId).set(storeId,[timerId,products]);
    }

    removeTimerAndCart = (userId: number, storeId: number):void =>{
        try{
            const [timerId, basket] = this.getTimerAndCart(userId,storeId);
            if(timerId === undefined) return;
            clearTimeout(timerId);
            this.cartCheckoutTimers.get(userId).delete(storeId);
        }catch(e){}
        return;
    }

    getTimerAndCart = (userId: number, storeId: number): [ReturnType<typeof setTimeout>, Map<number,number>] =>{
        try{
            const pair = this.cartCheckoutTimers.get(userId).get(storeId);
            if( pair !== undefined){
                return pair;
            }
        }catch(e){
            //nothing really, this is main case
        }
        return [undefined, undefined];
    } 

    hasCheckoutInProgress = (userId: number, storeId: number): boolean =>{
        const [timerId, cart] = this.getTimerAndCart(userId, storeId);
        return ((timerId !== undefined) && (cart !== undefined));
    }

    numTransactionsInProgress = (userId: number, storeId: number): number => {
        const transactions: Transaction[] = this.dbDummy.getTransactionsInProgress(userId,storeId);
        return transactions.length;
    }

    getTransactionInProgress = (userId: number, storeId: number): Transaction =>{
        return this.dbDummy.getTransactionInProgress(userId, storeId);
    }

    getCompletedTransactions = (userId: number, storeId: number): Transaction[] => {
        return this.dbDummy.getCompletedTransactions().filter(t => ((t.getUserId()==userId) &&(t.getStoreId()==storeId)));
    }
}
const INSTANCE :Purchase = new Purchase();
export default INSTANCE;