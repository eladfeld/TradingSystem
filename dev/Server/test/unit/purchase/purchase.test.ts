import {expect} from 'chai';
import PaymentSystem from '../../../src/DomainLayer/apis/PaymentSystem';
import SupplySystem from '../../../src/DomainLayer/apis/SupplySystem';
import { tPaymentInfo, tShippingInfo } from '../../../src/DomainLayer/purchase/Purchase';
import Purchase from '../../../src/DomainLayer/purchase/Purchase'
import Transaction, { TransactionStatus } from '../../../src/DomainLayer/purchase/Transaction';
import { isFailure, Result } from '../../../src/Result';



//checkout should have
var userId: number = -100;
var storeId: number = -7632;
var storeName: string = "Mega Bair";
const prod1Id: number=3000;
const prod2Id: number=4000;
const prod1Quantity: number=3;
const prod2Quantity: number=4;

const basket1a: Map<number, number> = new Map([[prod1Id,prod1Quantity]]);
const basket1b: Map<number, number> = new Map([[prod2Id,prod2Quantity]]);
const [total1a, total1b]: [number, number] = [30, 40];
const payInfo : tPaymentInfo = { holder: "shir" , id:2080, cardNumber:123, expMonth:5, expYear:2024, cvv:123, toAccount: 1, amount: 100};
const shippingInfo: tShippingInfo = {name:"shir", address:"rager", city:"beer sheva", country:"israel", zip:157};
const cb: ()=>void = ()=>{};

const updateValues = () => {
    userId--;
    storeId--;
}


describe('purchase tests' , function() {
    it('checkout, without completing order' , function(done){
        updateValues();
        PaymentSystem.willSucceed();
        SupplySystem.willSucceed();
        Purchase.checkout(storeId, total1a, userId, basket1a, storeName, cb);
        expect(Purchase.numTransactionsInProgress(userId,storeId)).to.equal(1);
        expect(Purchase.hasTransactionInProgress(userId,storeId)).to.equal(true);
        const transaction: Transaction = Purchase.getTransactionInProgress(userId, storeId);
        expect(transaction.getTotal()).to.equal(total1a);
        expect(transaction.getItems().get(prod1Id)).to.equal(prod1Quantity);
        done()
    });

    // it('checkout twice, should override first' , function(){//TODO: doubt
    //     updateValues();

    //     Purchase.checkout(storeId, total1a, userId, basket1a, cb);
    //     Purchase.checkout(storeId, total1b, userId, basket1b, cb);
    //     const allTransactions: Transaction[] = Purchase.getAllTransactionsForUser(userId).sort((t1,t2)=>t2.getTime()-t1.getTime());
    //     expect(allTransactions.length).to.equal(2);
    //     const [tCancelled, tInProgress] = allTransactions;
    //     //expect IN_PROGRESS transaction
    //     expect(tInProgress.getStatus()).to.equal(TransactionStatus.IN_PROGRESS);
    //     expect(tInProgress.getItems().get(prod1Id)).to.equal(undefined);
    //     expect(tInProgress.getItems().get(prod2Id)).to.equal(prod2Quantity);
    //     expect(tInProgress.getTotal()).to.equal(total1b);
    //     //expect CANCELLED transaction
    //     expect(tCancelled.getStatus()).to.equal(TransactionStatus.CANCELLED);
    //     expect(tCancelled.getItems().get(prod1Id)).to.equal(prod1Quantity);
    //     expect(tCancelled.getItems().get(prod2Id)).to.equal(undefined);
    //     expect(Purchase.hasTransactionInProgress(userId,storeId)).to.equal(true);
    // });



    it('checkout, then complete order within time' , function(done){
        updateValues();

        const res: Promise<boolean> = Purchase.checkout(storeId, total1a, userId, basket1a, storeName, cb);
        const res2: Promise<boolean> = Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 12345678 );
        expect(Purchase.numTransactionsInProgress(userId,storeId)).to.equal(0);
        const allTransactions: Transaction[] = Purchase.getAllTransactionsForUser(userId).sort((t1,t2)=>t2.getStatus()-t1.getStatus());
        expect(allTransactions.length).to.equal(1);
        const t: Transaction = allTransactions[0];
        expect(Purchase.hasTransactionInProgress(userId,storeId)).to.equal(false);
        expect(t.getItems().get(prod1Id)).to.equal(prod1Quantity);
        expect(t.getItems().get(prod2Id)).to.equal(undefined);
        expect(t.getStatus()).to.equal(TransactionStatus.COMPLETE);
        done();
    });

    it('attempt completing order before checkout' , function(done){
        updateValues();

        expect(Purchase.numTransactionsInProgress(userId,storeId)).to.equal(0);
        expect(Purchase.hasTransactionInProgress(userId,storeId)).to.equal(false);
        const res: Promise<boolean> = Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 1234);
        res.catch(value=>expect(value).to.equal(false));       
        done();
    });


    it('attempt completing order after payment time passed' , function(done){
        updateValues();

        Purchase.checkout(storeId, total1a, userId, basket1a, storeName, cb);
        setTimeout(() =>{
            const res: Promise<boolean> = Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 1234);
            res.catch(value=>expect(value).to.equal(false));       
        }, Purchase.getPaymentTimeoutInMillis()+1000);
        done();
    });

});
