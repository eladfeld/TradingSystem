import {expect} from 'chai';
import { PaymentInfo } from '../../../src/DomainLayer/purchase/PaymentInfo';
import Purchase from '../../../src/DomainLayer/purchase/Purchase'
import ShippingInfo from '../../../src/DomainLayer/purchase/ShippingInfo';
import Transaction, { TransactionStatus } from '../../../src/DomainLayer/purchase/Transaction';
import { Category } from '../../../src/DomainLayer/store/Common';
import { Product } from '../../../src/DomainLayer/store/Product';
import { ProductDB } from '../../../src/DomainLayer/store/ProductDB';
import { Store } from '../../../src/DomainLayer/store/Store';
import { Appointment } from '../../../src/DomainLayer/user/Appointment';
import { Subscriber } from '../../../src/DomainLayer/user/Subscriber';
import { isFailure, Result } from '../../../src/Result';



//checkout should have

const store1BankAcct = 11223344;
let subsriber = new Subscriber('something')
const store1: Store = new Store(subsriber.getUserId(),'store1', 12345678,"1 sunny ave");
Appointment.appoint_founder(subsriber, store1)
const store1Id: number = store1.getStoreId();
//const store2: Store = new Store(0,'store2',2,"2 sunny ave", 'none', 'none');
const user1Id: number = 100;
const user1Adrs: string = "8 Mile Road, Detroit";
const prod1Id: number=3000;
const prod2Id: number=4000;
const prod1Quantity: number=3;
const prod2Quantity: number=4;

const basket1a: Map<number, number> = new Map([[prod1Id,prod1Quantity]]);
const basket1b: Map<number, number> = new Map([[prod2Id,prod2Quantity]]);
const [total1a, total1b]: [number, number] = [30, 40];
store1.addNewProduct(subsriber, "s3000", [Category.ELECTRIC],1,10);
const prod: Product = ProductDB.getProductByName("s3000");
//const productId: number = prod.getProductId();
const payInfo: PaymentInfo = new PaymentInfo(12346,123,456);
const cb: ()=>void = ()=>{};
const shippingInfo: ShippingInfo = new ShippingInfo("src", "dst");


describe('purchase tests' , function() {

    it('checkout, without completing order' , function(){
        Purchase.checkout(store1Id, total1a, user1Id, basket1a, cb);
        expect(Purchase.numTransactionsInProgress(user1Id,store1Id)).to.equal(1);
        expect(Purchase.hasTransactionInProgress(user1Id,store1Id)).to.equal(true);
        const transaction: Transaction = Purchase.getTransactionInProgress(user1Id, store1Id);
        expect(transaction.getTotal()).to.equal(total1a);
        expect(transaction.getItems().get(3000)).to.equal(3);
    });

    it('checkout twice, should override first' , function(){
        Purchase.checkout(store1Id, total1a, user1Id, basket1a, cb);
        Purchase.checkout(store1Id, total1b, user1Id, basket1b, cb);
        const allTransactions: Transaction[] = Purchase.getAllTransactions().sort((t1,t2)=>t2.getTime()-t1.getTime());
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
        expect(Purchase.hasTransactionInProgress(user1Id,store1Id)).to.equal(true);
    });


    it('checkout, then complete order within time' , function(){
        const res: Result<boolean> = Purchase.checkout(store1Id, total1a, user1Id, basket1a, cb);
        const res2: Result<boolean> = Purchase.CompleteOrder(user1Id, store1Id, shippingInfo, payInfo, 12345678 );
        expect(Purchase.numTransactionsInProgress(user1Id,store1Id)).to.equal(0);
        const allTransactions: Transaction[] = Purchase.getAllTransactions().sort((t1,t2)=>t2.getTime()-t1.getTime());
        expect(allTransactions.length).to.equal(1);
        const t: Transaction = allTransactions[0];
        expect(Purchase.hasTransactionInProgress(user1Id,store1Id)).to.equal(false);
        expect(t.getItems().get(prod1Id)).to.equal(prod1Quantity);
        expect(t.getItems().get(prod2Id)).to.equal(undefined);
        expect(t.getStatus()).to.equal(TransactionStatus.COMPLETE);
    });

    it('attempt completing order before checkout' , function(){
        expect(Purchase.numTransactionsInProgress(user1Id,store1Id)).to.equal(0);
        expect(Purchase.hasTransactionInProgress(user1Id,store1Id)).to.equal(false);
        const res: Result<boolean> = Purchase.CompleteOrder(user1Id, store1Id, shippingInfo, payInfo, 1234);
        expect(isFailure(res)).to.equal(true);
    });


    it('attempt completing order after payment time passed' , function(){
        Purchase.checkout(store1Id, total1a, user1Id, basket1a, cb);
        setTimeout(() =>{
            const res: Result<boolean> = Purchase.CompleteOrder(user1Id, store1Id, shippingInfo, payInfo, 1234);
            expect(isFailure(res)).to.equal(true);
        }, Purchase.getPaymentTimeoutInMillis()+1000);
    });
});
