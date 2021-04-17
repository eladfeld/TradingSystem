import {expect} from 'chai';
import { PaymentInfo } from '../../src/DomainLayer/purchase/PaymentInfo';
import Purchase from '../../src/DomainLayer/purchase/Purchase'
import Transaction, { TransactionStatus } from '../../src/DomainLayer/purchase/Transaction';
import { Category } from '../../src/DomainLayer/store/Common';
import { Product } from '../../src/DomainLayer/store/Product';
import { ProductDB } from '../../src/DomainLayer/store/ProductDB';
import { Store } from '../../src/DomainLayer/store/Store';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, Result } from '../../src/Result';



//checkout should have

const store1Id: number = 1;
const store1BankAcct = 11223344;
const store1: Store = new Store(0,'store1',store1Id,"1 sunny ave");
//const store2: Store = new Store(0,'store2',2,"2 sunny ave", 'none', 'none');
const user1Id: number = 100;
const user1Adrs: string = "8 Mile Road, Detroit";
const basket1a: Map<number, number> = new Map([[3000,3]]);
const basket1b: Map<number, number> = new Map([[4000,4]]);
const [total1a, total1b]: [number, number] = [30, 40];
let subscriber = new Subscriber('Tzuri')
store1.addNewProduct(subscriber, "s3000", [Category.COMPUTER],1,10);
const prod: Product = ProductDB.getProductByName("s3000");
//const productId: number = prod.getProductId();
const payInfo: PaymentInfo = new PaymentInfo(12346,123,456);



describe('purchase tests' , function() {

    it('checkout, without completing order' , function(){
        Purchase.checkout(store1, total1a, user1Id, basket1a, user1Adrs);
        expect(Purchase.numTransactionsInProgress(user1Id,store1Id)).to.equal(1);
        expect(Purchase.hasCheckoutInProgress(user1Id,store1Id)).to.equal(true);
        const transaction: Transaction = Purchase.getTransactionInProgress(user1Id, store1Id);
        expect(transaction.getTotal()).to.equal(total1b);
        expect(transaction.getItems().get(3000)).to.equal(3);
    });

    it('checkout twice, should override first' , function(){
        Purchase.checkout(store1, total1a, user1Id, basket1a, user1Adrs);
        Purchase.checkout(store1, total1b, user1Id, basket1b, user1Adrs);
        expect(Purchase.numTransactionsInProgress(user1Id,store1Id)).to.equal(1);
        expect(Purchase.hasCheckoutInProgress(user1Id,store1Id)).to.equal(true);
        const transaction: Transaction = Purchase.getTransactionInProgress(user1Id, store1Id);
        expect(transaction.getTotal()).to.equal(total1b);
        expect(transaction.getItems().get(3000)).to.equal(3);
        expect(transaction.getItems().get(4000)).to.equal(undefined);
        expect(transaction.getStatus()).to.equal(TransactionStatus.ITEMS_RESERVED);
    });


    it('checkout, then complete order' , function(){
        Purchase.checkout(store1, total1a, user1Id, basket1a, user1Adrs);
        Purchase.CompleteOrder(user1Id, store1Id, payInfo );
        expect(Purchase.numTransactionsInProgress(user1Id,store1Id)).to.equal(0);
        expect(Purchase.hasCheckoutInProgress(user1Id,store1Id)).to.equal(false);
        const transactions: Transaction[] = Purchase.getCompletedTransactions(user1Id, store1Id);
        expect(transactions.length).to.equal(1);
        const transaction: Transaction = transactions[0];
        expect(transaction.getItems().get(3000)).to.equal(3);
        expect(transaction.getItems().get(4000)).to.equal(undefined);
        expect(transaction.getStatus()).to.equal(TransactionStatus.SUPPLIED);
    });

    it('attempt completing order before checkout' , function(){
        //Purchase.checkout(store1, total1a, user1Id, basket1a, user1Adrs);
        expect(Purchase.numTransactionsInProgress(user1Id,store1Id)).to.equal(0);
        expect(Purchase.hasCheckoutInProgress(user1Id,store1Id)).to.equal(false);
        const res: Result<boolean> = Purchase.CompleteOrder(user1Id, store1Id, payInfo);
        expect(isFailure(res)).to.equal(true);
    });
});
