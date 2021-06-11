import {expect} from 'chai';
import PaymentSystem from '../../../src/DomainLayer/apis/PaymentSystem';
import SupplySystem from '../../../src/DomainLayer/apis/SupplySystem';
import { tPaymentInfo, tShippingInfo } from '../../../src/DomainLayer/purchase/Purchase';
import Purchase from '../../../src/DomainLayer/purchase/Purchase'
import Transaction, { TransactionStatus } from '../../../src/DomainLayer/purchase/Transaction';
import { isFailure, Result } from '../../../src/Result';
import { APIsWillSucceed, failIfResolved, failTest, setReady, uniqueMegaName, waitToRun } from '../../testUtil';



//checkout should have
var uId: number = -100;
var sId: number = -7632;
var storeName: string = "Mega Bair";
const prod1Id: number=3000;
const prod2Id: number=4000;
const prod1Quantity: number=3;
const prod2Quantity: number=4;
const basket1a: Map<number, [number, string, number]> = new Map([[prod1Id,[1,"something",prod1Quantity]]]);
const basket1b: Map<number, [number, string, number]> = new Map([[prod2Id,[2,"something else",prod2Quantity]]]);
const [total1a, total1b]: [number, number] = [30, 40];
const payInfo : tPaymentInfo = { holder: "shir" , id:2080, cardNumber:123, expMonth:5, expYear:2024, cvv:123, toAccount: 1, amount: 100};
const shippingInfo: tShippingInfo = {name:"shir", address:"rager", city:"beer sheva", country:"israel", zip:157};
const cb: ()=>void = ()=>{};



describe('purchase tests' , function() {
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });

    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });

    it('checkout, without completing order' , async function(){
        const userId = uId--;
        const storeId = sId--;
        PaymentSystem.willSucceed();
        SupplySystem.willSucceed();
        await Purchase.checkout(storeId, total1a, userId, basket1a, storeName, cb);
        expect(await Purchase.numTransactionsInProgress(userId,storeId)).to.equal(1);
        expect(Purchase.hasTransactionInProgress(userId,storeId)).to.equal(true);
        const transaction: Transaction = await Purchase.getTransactionInProgress(userId, storeId);
        expect(transaction.getTotal()).to.equal(total1a);
        expect(transaction.getItems().get(prod1Id)[2]).to.equal(prod1Quantity);
    });

    it('checkout twice, should override first' ,async function(){//TODO: doubt
        const userId = uId--;
        const storeId = sId--;
        const storeName = uniqueMegaName()
        await Purchase.checkout(storeId, total1a, userId, basket1a,storeName, cb);
        await Purchase.checkout(storeId, total1b, userId, basket1b,storeName, cb);
        //good if reaches here, shouldnt throw an error
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
        expect(t.getItems().get(prod1Id)[2]).to.equal(prod1Quantity);
        expect(t.getItems().get(prod2Id)).to.equal(undefined);
        expect(t.getStatus()).to.equal(TransactionStatus.COMPLETE);
        //return new Promise(res,rej) =>
    });

    it('attempt completing order before checkout' , async function(){
        const userId = uId--;
        const storeId = sId--;

        expect(await Purchase.numTransactionsInProgress(userId,storeId)).to.equal(0);
        expect(Purchase.hasTransactionInProgress(userId,storeId)).to.equal(false);
        var succeeded = false;
        try{
            await Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 1234);
            succeeded = true;
        }catch(e){
            expect(e).to.equal("No checkout in progress")
        }
        if(succeeded)failTest("should have failed to complete order")
    });


    it('attempt completing order after payment time passed' , async function(){
        const userId = uId--;
        const storeId = sId--;
        this.timeout(Purchase.getPaymentTimeoutInMillis()+2000);

        await Purchase.checkout(storeId, total1a, userId, basket1a, storeName, cb);

        setTimeout(async() =>{
            await failIfResolved(()=> Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 1234));
        }, Purchase.getPaymentTimeoutInMillis()+300);

    });

});
