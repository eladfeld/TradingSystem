import {expect} from 'chai';
//import { config } from 'dotenv';
import {setTestConfigurations} from '../../../src/config';
import PaymentSystem from '../../../src/DomainLayer/apis/PaymentSystem';
import SupplySystem from '../../../src/DomainLayer/apis/SupplySystem';
import { Value } from '../../../src/DomainLayer/discount/logic/Predicate';
import Purchase, { tPaymentInfo, tShippingInfo } from '../../../src/DomainLayer/purchase/Purchase'
import Transaction, { TransactionStatus } from '../../../src/DomainLayer/purchase/Transaction';
import { isFailure, isOk, Result } from '../../../src/Result';



//checkout should have
var userId: number = -1000;
var storeId: number = -7653;
var storeName: string = "Mega Bair";
const userAdrs: string = "8 Mile Road, Detroit";
const prod1Id: number=3000;
const prod2Id: number=4000;
const prod1Quantity: number=3;
const prod2Quantity: number=4;
setTestConfigurations();        //changing external APIs to mocks
const basket1a: Map<number, number> = new Map([[prod1Id,prod1Quantity]]);
const basket1b: Map<number, number> = new Map([[prod2Id,prod2Quantity]]);
const [total1a, total1b]: [number, number] = [30, 40];
const payInfo : tPaymentInfo = { holder: "shir" , id:2080, cardNumber:123, expMonth:5, expYear:2024, cvv:123, toAccount: 1, amount: 100};
const shippingInfo: tShippingInfo = {name:"shir", address:"rager", city:"beer sheva", country:"israel", zip:157};
const cb: ()=>void = ()=>{};

const updateValues = () => {
    userId--;
}


describe('purchase with api fail tests' , function() {
    it('supply system fails' , function(){
        updateValues();
        PaymentSystem.willSucceed();
        SupplySystem.willFail();
        const checkoutRes: Promise<boolean> = Purchase.checkout(storeId, total1a, userId, basket1a, storeName, cb);
        checkoutRes.then(value=>expect(value).to.equal(true));
        const completionRes: Promise<boolean> = Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 1234);
        completionRes.catch(value=>expect(value).to.equal(false));       
        const allTransactions: Transaction[] = Purchase.getAllTransactionsForUser(userId);
        expect(allTransactions.length).to.equal(1);
        const t: Transaction = allTransactions[0];
        expect(t.getStatus()).to.equal(TransactionStatus.IN_PROGRESS);
    });

    it('payment system fails' , function(){
        updateValues();
        SupplySystem.willSucceed();
        PaymentSystem.willFail();

        const checkoutRes: Promise<boolean> = Purchase.checkout(storeId, total1a, userId, basket1a, storeName, cb);
        checkoutRes.then(value=>expect(value).to.equal(true));
        const completionRes: Promise<boolean> = Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 1234);
        completionRes.catch(value=>expect(value).to.equal(false));       
        const allTransactions: Transaction[] = Purchase.getAllTransactionsForUser(userId);
        expect(allTransactions.length).to.equal(1);
        const t: Transaction = allTransactions[0];
        expect(t.getStatus()).to.equal(TransactionStatus.IN_PROGRESS);
    });



});
