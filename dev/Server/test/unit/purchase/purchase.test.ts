import {expect} from 'chai';
import PaymentSystem from '../../../src/DomainLayer/apis/PaymentSystem';
import SupplySystem from '../../../src/DomainLayer/apis/SupplySystem';
import { PaymentInfo } from '../../../src/DomainLayer/purchase/PaymentInfo';
import Purchase from '../../../src/DomainLayer/purchase/Purchase'
import ShippingInfo from '../../../src/DomainLayer/purchase/ShippingInfo';
import Transaction, { TransactionStatus } from '../../../src/DomainLayer/purchase/Transaction';
import { Product } from '../../../src/DomainLayer/store/Product';
import { ProductDB } from '../../../src/DomainLayer/store/ProductDB';
import { Store } from '../../../src/DomainLayer/store/Store';
import { Appointment } from '../../../src/DomainLayer/user/Appointment';
import { MakeAppointment } from '../../../src/DomainLayer/user/MakeAppointment';
import { Subscriber } from '../../../src/DomainLayer/user/Subscriber';
import { isFailure, Result } from '../../../src/Result';



//checkout should have
var userId: number = 100;
var storeId: number = 7632;
const userAdrs: string = "8 Mile Road, Detroit";
const prod1Id: number=3000;
const prod2Id: number=4000;
const prod1Quantity: number=3;
const prod2Quantity: number=4;

const basket1a: Map<number, number> = new Map([[prod1Id,prod1Quantity]]);
const basket1b: Map<number, number> = new Map([[prod2Id,prod2Quantity]]);
const [total1a, total1b]: [number, number] = [30, 40];
const payInfo: PaymentInfo = new PaymentInfo(12346,123,456);
const shippingInfo: ShippingInfo = new ShippingInfo("src", "dst");
const cb: ()=>void = ()=>{};

const updateValues = () => {
    userId++;
}


describe('purchase tests' , function() {

    it('checkout, without completing order' , function(){
        updateValues();
        PaymentSystem.willSucceed();
        SupplySystem.willSucceed();
        Purchase.checkout(storeId, total1a, userId, basket1a, cb);
        expect(Purchase.numTransactionsInProgress(userId,storeId)).to.equal(1);
        expect(Purchase.hasTransactionInProgress(userId,storeId)).to.equal(true);
        const transaction: Transaction = Purchase.getTransactionInProgress(userId, storeId);
        expect(transaction.getTotal()).to.equal(total1a);
        expect(transaction.getItems().get(prod1Id)).to.equal(prod1Quantity);
    });

    it('checkout twice, should override first' , function(){
        updateValues();

        Purchase.checkout(storeId, total1a, userId, basket1a, cb);
        Purchase.checkout(storeId, total1b, userId, basket1b, cb);
        const allTransactions: Transaction[] = Purchase.getAllTransactionsForUser(userId).sort((t1,t2)=>t2.getTime()-t1.getTime());
        expect(allTransactions.length).to.equal(2);
        const [tCancelled, tInProgress] = allTransactions;
        //expect IN_PROGRESS transaction
        expect(tInProgress.getStatus()).to.equal(TransactionStatus.IN_PROGRESS);
        expect(tInProgress.getItems().get(prod1Id)).to.equal(undefined);
        expect(tInProgress.getItems().get(prod2Id)).to.equal(prod2Quantity);
        expect(tInProgress.getTotal()).to.equal(total1b);
        //expect CANCELLED transaction
        expect(tCancelled.getStatus()).to.equal(TransactionStatus.CANCELLED);
        expect(tCancelled.getItems().get(prod1Id)).to.equal(prod1Quantity);
        expect(tCancelled.getItems().get(prod2Id)).to.equal(undefined);
        expect(Purchase.hasTransactionInProgress(userId,storeId)).to.equal(true);
    });


    it('checkout, then complete order within time' , function(){
        updateValues();

        const res: Result<boolean> = Purchase.checkout(storeId, total1a, userId, basket1a, cb);
        const res2: Result<boolean> = Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 12345678 );
        expect(Purchase.numTransactionsInProgress(userId,storeId)).to.equal(0);
        const allTransactions: Transaction[] = Purchase.getAllTransactionsForUser(userId).sort((t1,t2)=>t2.getTime()-t1.getTime());
        expect(allTransactions.length).to.equal(1);
        const t: Transaction = allTransactions[0];
        expect(Purchase.hasTransactionInProgress(userId,storeId)).to.equal(false);
        expect(t.getItems().get(prod1Id)).to.equal(prod1Quantity);
        expect(t.getItems().get(prod2Id)).to.equal(undefined);
        expect(t.getStatus()).to.equal(TransactionStatus.COMPLETE);
    });

    it('attempt completing order before checkout' , function(){
        updateValues();

        expect(Purchase.numTransactionsInProgress(userId,storeId)).to.equal(0);
        expect(Purchase.hasTransactionInProgress(userId,storeId)).to.equal(false);
        const res: Result<boolean> = Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 1234);
        expect(isFailure(res)).to.equal(true);
    });


    it('attempt completing order after payment time passed' , function(){
        updateValues();

        Purchase.checkout(storeId, total1a, userId, basket1a, cb);
        setTimeout(() =>{
            const res: Result<boolean> = Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 1234);
            expect(isFailure(res)).to.equal(true);
        }, Purchase.getPaymentTimeoutInMillis()+1000);
    });
});
