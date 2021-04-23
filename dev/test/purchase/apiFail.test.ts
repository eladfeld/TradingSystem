import {expect} from 'chai';
import PaymentSystem from '../../src/DomainLayer/apis/PaymentSystem';
import SupplySystem from '../../src/DomainLayer/apis/SupplySystem';
import { PaymentInfo } from '../../src/DomainLayer/purchase/PaymentInfo';
import Purchase from '../../src/DomainLayer/purchase/Purchase'
import Transaction, { TransactionProgress } from '../../src/DomainLayer/purchase/Transaction';
import { Category } from '../../src/DomainLayer/store/Common';
import { Product } from '../../src/DomainLayer/store/Product';
import { ProductDB } from '../../src/DomainLayer/store/ProductDB';
import { Store } from '../../src/DomainLayer/store/Store';
import { Appointment } from '../../src/DomainLayer/user/Appointment';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';



//checkout should have

const store1BankAcct = 11223344;
let subsriber = new Subscriber('something')
const store1: Store = new Store(subsriber.getUserId(),'store_1', 12345678,"1 sunny ave");
Appointment.appoint_founder(subsriber, store1)
const store1Id: number = store1.getStoreId();
//const store2: Store = new Store(0,'store2',2,"2 sunny ave", 'none', 'none');
const user1Id: number = 101;
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

    it('fail on reserve supply' , function(){
        PaymentSystem.willSucceed();
        SupplySystem.willFail();

        const res: Result<boolean> = Purchase.checkout(store1, total1a, user1Id, basket1a, user1Adrs);
        expect(isFailure(res)).to.equal(true);
        expect(Purchase.getAllTransactions().length).to.equal(0);
        //TODO: check store inventory

        const res2: Result<boolean> = Purchase.CompleteOrder(user1Id, store1Id, payInfo );
        expect(isFailure(res2)).to.equal(true);
        expect(Purchase.getAllTransactions().length).to.equal(0);
        //TODO: check store inventory
    });

    it('fail on pay' , function(){
        SupplySystem.willSucceed();
        PaymentSystem.willFail();

        const res: Result<boolean> = Purchase.checkout(store1, total1a, user1Id, basket1a, user1Adrs);
        expect(isOk(res) && res.value==true).to.equal(true);
        const transactions: Transaction[] = Purchase.getAllTransactions();
        expect(transactions.length).to.equal(1);
        const t: Transaction = transactions[0];
        expect(t.getProgress()).to.equal(TransactionProgress.SUPPLY_APPROVED);
        //TODO: check store inventory

        const res2: Result<boolean> = Purchase.CompleteOrder(user1Id, store1Id, payInfo );
        expect(isFailure(res2)).to.equal(true);
        expect(Purchase.getFTransactions().length).to.equal(0);
        //TODO: check store inventory
    });

    it('fail on order supply' , function(){
    
    });
});
