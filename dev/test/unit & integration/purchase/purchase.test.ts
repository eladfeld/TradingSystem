import {expect} from 'chai';
<<<<<<< HEAD:dev/test/purchase/purchase.test.ts
import { PaymentInfo } from '../../src/DomainLayer/purchase/PaymentInfo';
import Purchase from '../../src/DomainLayer/purchase/Purchase'
import Transaction, { TransactionProgress } from '../../src/DomainLayer/purchase/Transaction';
import { Category } from '../../src/DomainLayer/store/Common';
import { Product } from '../../src/DomainLayer/store/Product';
import { ProductDB } from '../../src/DomainLayer/store/ProductDB';
import { Store } from '../../src/DomainLayer/store/Store';
import { Appointment } from '../../src/DomainLayer/user/Appointment';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, Result } from '../../src/Result';
=======
import { PaymentInfo } from '../../../src/DomainLayer/purchase/PaymentInfo';
import Purchase from '../../../src/DomainLayer/purchase/Purchase'
import Transaction, { TransactionStatus } from '../../../src/DomainLayer/purchase/Transaction';
import { Category } from '../../../src/DomainLayer/store/Common';
import { Product } from '../../../src/DomainLayer/store/Product';
import { ProductDB } from '../../../src/DomainLayer/store/ProductDB';
import { Store } from '../../../src/DomainLayer/store/Store';
import { Appointment } from '../../../src/DomainLayer/user/Appointment';
import { Subscriber } from '../../../src/DomainLayer/user/Subscriber';
import { isFailure, Result } from '../../../src/Result';
>>>>>>> 96f57c859d016bf1b6f21b634b0f1d3e3942abbc:dev/test/unit & integration/purchase/purchase.test.ts



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



describe('purchase tests' , function() {

    it('checkout, without completing order' , function(){
        Purchase.checkout(store1, total1a, user1Id, basket1a, user1Adrs);
        expect(Purchase.numTransactionsInProgress(user1Id,store1Id)).to.equal(1);
        expect(Purchase.hasCheckoutInProgress(user1Id,store1Id)).to.equal(true);
        const transaction: Transaction = Purchase.getTransactionInProgress(user1Id, store1Id);
        expect(transaction.getTotal()).to.equal(total1a);
        expect(transaction.getItems().get(3000)).to.equal(3);
    });

    it('checkout twice, should override first' , function(){
        Purchase.checkout(store1, total1a, user1Id, basket1a, user1Adrs);
        Purchase.checkout(store1, total1b, user1Id, basket1b, user1Adrs);
        expect(Purchase.numTransactionsInProgress(user1Id,store1Id)).to.equal(1);
        expect(Purchase.hasCheckoutInProgress(user1Id,store1Id)).to.equal(true);
        const transaction: Transaction = Purchase.getTransactionInProgress(user1Id, store1Id);
        expect(transaction.getTotal()).to.equal(total1b);
        expect(transaction.getItems().get(prod1Id)).to.equal(undefined);
        expect(transaction.getItems().get(prod2Id)).to.equal(prod2Quantity);
        expect(transaction.getProgress()).to.equal(TransactionProgress.SUPPLY_APPROVED);
    });


    it('checkout, then complete order within time' , function(){
        const res: Result<boolean> = Purchase.checkout(store1, total1a, user1Id, basket1a, user1Adrs);
        const res2: Result<boolean> = Purchase.CompleteOrder(user1Id, store1Id, payInfo );
        expect(Purchase.numTransactionsInProgress(user1Id,store1Id)).to.equal(0);
        expect(Purchase.hasCheckoutInProgress(user1Id,store1Id)).to.equal(false);
        const transactions: Transaction[] = Purchase.getCompletedTransactions(user1Id, store1Id);
        expect(transactions.length).to.equal(1);
        const transaction: Transaction = transactions[0];
        expect(transaction.getItems().get(3000)).to.equal(3);
        expect(transaction.getItems().get(4000)).to.equal(undefined);
        expect(transaction.getProgress()).to.equal(TransactionProgress.SUPPLIED);
    });

    it('attempt completing order before checkout' , function(){
        expect(Purchase.numTransactionsInProgress(user1Id,store1Id)).to.equal(0);
        expect(Purchase.hasCheckoutInProgress(user1Id,store1Id)).to.equal(false);
        const res: Result<boolean> = Purchase.CompleteOrder(user1Id, store1Id, payInfo);
        expect(isFailure(res)).to.equal(true);
    });


    it('attempt completing order after payment time passed' , function(){
        Purchase.checkout(store1, total1a, user1Id, basket1a, user1Adrs);
        setTimeout(() =>{
            const res: Result<boolean> = Purchase.CompleteOrder(user1Id, store1Id, payInfo);
            expect(isFailure(res)).to.equal(true);
        }, Purchase.getPaymentTimeoutInMillis()+1000);
    });
});
