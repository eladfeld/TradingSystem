import {expect} from 'chai';
import PaymentSystem from '../../../src/DomainLayer/apis/PaymentSystem';
import SupplySystem from '../../../src/DomainLayer/apis/SupplySystem';
import { PaymentInfo } from '../../../src/DomainLayer/purchase/PaymentInfo';
import Purchase from '../../../src/DomainLayer/purchase/Purchase'
import ShippingInfo from '../../../src/DomainLayer/purchase/ShippingInfo';
import Transaction, { TransactionStatus } from '../../../src/DomainLayer/purchase/Transaction';
import { isFailure, Result } from '../../../src/Result';
import {APIsWillSucceed, failIfResolved} from '../../testUtil';



//checkout should have
var uId: number = -100;
var sId: number = -7632;
var storeName: string = "Mega Bair";
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
    userId--;
    storeId--;
}


describe('purchase tests' , function() {

    beforeEach(function () {
        APIsWillSucceed();
    });

    it('checkout, without completing order' , async function(done){
        const userId = uId--;
        const storeId = sId--;
        await Purchase.checkout(storeId, total1a, userId, basket1a, storeName, cb);
        expect(Purchase.numTransactionsInProgress(userId,storeId)).to.equal(1);
        expect(Purchase.hasTransactionInProgress(userId,storeId)).to.equal(true);
        const transaction: Transaction = await Purchase.getTransactionInProgress(userId, storeId);
        expect(transaction.getTotal()).to.equal(total1a);
        expect(transaction.getItems().get(prod1Id)).to.equal(prod1Quantity);
        done()
    });

    it('checkout twice, should override first' ,async function(){//TODO: doubt
        const userId = uId--;
        const storeId = sId--;

        await Purchase.checkout(storeId, total1a, userId, basket1a, cb);
        await Purchase.checkout(storeId, total1b, userId, basket1b, cb);
        const allTransactions: Transaction[] = (await Purchase.getAllTransactionsForUser(userId)).sort((t1,t2)=>t2.getTime()-t1.getTime());
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



    it('checkout, then complete order within time' , async function(){
        const userId = uId--;
        const storeId = sId--;

        const res: boolean = await Purchase.checkout(storeId, total1a, userId, basket1a, storeName, cb);
        const res2: boolean = await Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 12345678 );
        expect(await Purchase.numTransactionsInProgress(userId,storeId)).to.equal(0);
        const allTransactions: Transaction[] = (await Purchase.getAllTransactionsForUser(userId)).sort((t1,t2)=>t2.getStatus()-t1.getStatus());
        expect(allTransactions.length).to.equal(1);
        const t: Transaction = allTransactions[0];
        expect(Purchase.hasTransactionInProgress(userId,storeId)).to.equal(false);
        expect(t.getItems().get(prod1Id)).to.equal(prod1Quantity);
        expect(t.getItems().get(prod2Id)).to.equal(undefined);
        expect(t.getStatus()).to.equal(TransactionStatus.COMPLETE);
    });

    it('attempt completing order before checkout' ,async function(done){
        const userId = uId--;
        const storeId = sId--;

        expect(await Purchase.numTransactionsInProgress(userId,storeId)).to.equal(0);
        expect(Purchase.hasTransactionInProgress(userId,storeId)).to.equal(false);
        await failIfResolved(()=> Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 1234));
    });


    it('attempt completing order after payment time passed' ,async function(){
        const userId = uId--;
        const storeId = sId--;

        await Purchase.checkout(storeId, total1a, userId, basket1a, storeName, cb);
        setTimeout(async () =>{
            await failIfResolved(()=> Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 1234));
        }, Purchase.getPaymentTimeoutInMillis()+1000);
    });

});
