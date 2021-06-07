import {expect} from 'chai';
import { PurchaseDB } from '../../../src/DataAccessLayer/DBinit';
//import { config } from 'dotenv';
import PaymentSystem from '../../../src/DomainLayer/apis/PaymentSystem';
import SupplySystem from '../../../src/DomainLayer/apis/SupplySystem';
import { Value } from '../../../src/DomainLayer/discount/logic/Predicate';
import Purchase, { tPaymentInfo, tShippingInfo } from '../../../src/DomainLayer/purchase/Purchase'
import Transaction, { TransactionStatus } from '../../../src/DomainLayer/purchase/Transaction';
import { APIsWillSucceed, failIfResolved, setReady, waitToRun } from '../../testUtil';



//checkout should have

//checkout should have
var uId: number = -1000;
var sId: number = -7653;
var storeName: string = "Mega Bair";
const userAdrs: string = "8 Mile Road, Detroit";
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




describe('purchase with api fail tests' , function() {

    beforeEach(function () {
    });

    beforeEach( () => {
        console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });

    afterEach(function () {
        console.log('finish');   
        APIsWillSucceed();
        setReady(true);
    });

    it('supply system fails' , async function(){
        const userId = uId--;
        const storeId = sId--;
        SupplySystem.willFail();
        await Purchase.checkout(storeId, total1a, userId, basket1a, storeName, cb);
        failIfResolved(()=> Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 1234));
    });

    it('payment system fails' ,async function(){
        const userId = uId--;
        const storeId = sId--;
        PaymentSystem.willFail();
        await Purchase.checkout(storeId, total1a, userId, basket1a, storeName, cb);
        failIfResolved(()=> Purchase.CompleteOrder(userId, storeId, shippingInfo, payInfo, 1234));
    });



});
