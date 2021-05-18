import {expect} from 'chai';
import PaymentSystem from '../../../src/DomainLayer/apis/PaymentSystem';
import SupplySystem from '../../../src/DomainLayer/apis/SupplySystem';
import { PaymentInfo } from '../../../src/DomainLayer/purchase/PaymentInfo';
import Purchase from '../../../src/DomainLayer/purchase/Purchase'
import ShippingInfo from '../../../src/DomainLayer/purchase/ShippingInfo';
import Transaction, { TransactionStatus } from '../../../src/DomainLayer/purchase/Transaction';
import { isFailure, isOk, Result } from '../../../src/Result';



//checkout should have

//checkout should have
var userId: number = -1000;
var storeId: number = -7653;
var storeName: string = "Mega Bair";
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
    userId--;
}

describe('purchase with api fail tests' , function() {
    it('supply system fails' , function(){
        updateValues();
        PaymentSystem.willSucceed();
        SupplySystem.willFail();

        const checkoutRes: Result<boolean> = Purchase.checkout(storeId, total1a, userId, basket1a, storeName, cb);
        expect(isOk(checkoutRes)).to.equal(true);
        const completionRes: Result<boolean> = Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 1234);
        expect(isFailure(completionRes)).to.equal(true);
        const allTransactions: Transaction[] = Purchase.getAllTransactionsForUser(userId);
        expect(allTransactions.length).to.equal(1);
        const t: Transaction = allTransactions[0];
        expect(t.getStatus()).to.equal(TransactionStatus.IN_PROGRESS);
    });

    it('payment system fails' , function(){
        updateValues();
        SupplySystem.willSucceed();
        PaymentSystem.willFail();

        const checkoutRes: Result<boolean> = Purchase.checkout(storeId, total1a, userId, basket1a, storeName, cb);
        expect(isOk(checkoutRes)).to.equal(true);
        const completionRes: Result<boolean> = Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 1234);
        expect(isFailure(completionRes)).to.equal(true);
        const allTransactions: Transaction[] = Purchase.getAllTransactionsForUser(userId);
        expect(allTransactions.length).to.equal(1);
        const t: Transaction = allTransactions[0];
        expect(t.getStatus()).to.equal(TransactionStatus.IN_PROGRESS);
    });



});
