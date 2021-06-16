import { assert, expect } from 'chai';
import Purchase, { tPaymentInfo, tShippingInfo } from '../../src/DomainLayer/purchase/Purchase';
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed, failIfResolved, uniqueAviName, uniqueMegaName, uniqueName } from '../testUtil';
import { register_login, open_store, SHIPPING_INFO, PAYMENT_INFO } from './common';

declare interface PromiseConstructor {
    allSettled(promises: Array<Promise<any>>): Promise<Array<{ status: 'fulfilled' | 'rejected', value?: any, reason?: any }>>;
}

const payInfo : tPaymentInfo = { holder: "Rick" , id:244, cardNumber:123, expMonth:5, expYear:2024, cvv:123, toAccount: 1, amount: 100};

const shippingInfo: tShippingInfo = {name:"Rick", address:"kineret", city:"jerusalem", country:"israel", zip:8727};
import {setReady, waitToRun} from '../testUtil';
import { DB } from '../../src/DataAccessLayer/DBfacade';

describe('2.9: buy products',function () {
    //setTestConfigurations();        //changing external APIs to mocks
    
    beforeEach( () => {
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        setReady(true);
    });
    it('buy shopping basket', async function () {
        this.timeout(100000)
        var service: Service =await Service.get_instance();
        let avi_sessionId = await service.enter()
        let avi = await register_login(service, avi_sessionId, uniqueAviName(), "1234");
        let store = await open_store(service, avi_sessionId, avi, uniqueMegaName(), 123456, "Tel aviv");
        await store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(avi_sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50,"");
        let apple = await service.addNewProduct(avi_sessionId, store.getStoreId(), "apple", ['Sweet'], 1, 10,"");
        await service.addProductTocart(avi_sessionId, store.getStoreId(), banana, 10);
        await service.addProductTocart(avi_sessionId, store.getStoreId(), apple, 7);
        await service.checkoutBasket(avi_sessionId, store.getStoreId(), shippingInfo);
        let purchase_res = await service.completeOrder(avi_sessionId, store.getStoreId(), payInfo, shippingInfo)

        expect(purchase_res).to.equal(true)
        // check basktet updated successfully
        expect(avi.quantityInBasket(store.getStoreId(),banana)).to.equal(0)
        expect(avi.quantityInBasket(store.getStoreId(),apple)).to.equal(0)

        // check store inventory updated successfully

        store = await DB.getStoreByID(store.getStoreId())
        expect(store.getProductQuantity(banana)).to.equal(40)
        expect(store.getProductQuantity(apple)).to.equal(3)
        
        // if transaction completed then the external systems were activated 
        await Purchase.getCompletedTransactionsForUser(avi.getUserId())
    })


    it('try to buy too much items', async function () {
        this.timeout(100000)
        var service: Service =await Service.get_instance();
        // avi and ali enter the system register and login
        let ali_sessionId = await service.enter()
        let avi_sessionId = await service.enter()
        let avi = await register_login(service, avi_sessionId, uniqueAviName(), "1234");
        let ali = await register_login(service, ali_sessionId, uniqueName("ali"), "1234");

        // avi opens store and adds 50 bananas to it
        let store = await open_store(service, avi_sessionId, avi, uniqueMegaName(), 123456, "Tel aviv");
        await service.addCategoryToRoot(avi_sessionId, store.getStoreId(),'Sweet')
        let banana = await service.addNewProduct(avi_sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50,"");

        // avi and ali both add 40 bananas to their basket
        await service.addProductTocart(avi_sessionId, store.getStoreId(), banana, 40);
        await service.addProductTocart(ali_sessionId, store.getStoreId(), banana, 40);

        // avi buys 40 bananas successfully
        await service.checkoutBasket(avi_sessionId, store.getStoreId(), SHIPPING_INFO);
        await service.completeOrder(avi_sessionId, store.getStoreId(), PAYMENT_INFO,SHIPPING_INFO);
        
        await failIfResolved(()=>service.checkoutBasket(ali_sessionId, store.getStoreId(), SHIPPING_INFO))

        // check that the basket of ali hasn't changed
        expect(ali.quantityInBasket(store.getStoreId(),banana)).to.equal(40)
        // chech that the store's inventory hasnt changed
        store =await DB.getStoreByID(store.getStoreId())
        expect(store.getProductQuantity(banana)).to.equal(10)
        // check that transaction wasnt completed
        //expect((await Purchase.getCompletedTransactionsForUser(avi.getUserId())).length).to.equal(1);
        //expect((await Purchase.getCompletedTransactionsForUser(ali.getUserId())).length).to.equal(0);
        await service.getMyPurchaseHistory(avi_sessionId)
        await service.getMyPurchaseHistory(ali_sessionId)
        
    })

    
    
    it('parallel buy of last item',async function () {
        this.timeout(100000)
        var service: Service =await Service.get_instance();
        //avi and ali enters the system
        let avi_sessionId = await service.enter();
        let ali_sessionId = await service.enter();
        let avi = await register_login(service, avi_sessionId, uniqueAviName(), "1234");
        let ali = await register_login(service, ali_sessionId, uniqueName("ali"), "1234");
        
        let store = await open_store(service, avi_sessionId, avi, uniqueMegaName(), 123456, "Tel aviv");
        await store.addCategoryToRoot('Sweet');
        let banana_id = await service.addNewProduct(avi_sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 1,"")
        await service.addProductTocart(avi_sessionId, store.getStoreId(), banana_id, 1)
        await service.addProductTocart(ali_sessionId, store.getStoreId(), banana_id, 1)
        await service.checkoutBasket(ali_sessionId, store.getStoreId(), SHIPPING_INFO)
        await failIfResolved(()=> service.checkoutBasket(avi_sessionId, store.getStoreId(), SHIPPING_INFO))
        await service.completeOrder(ali_sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO);
        await failIfResolved(()=> service.completeOrder(avi_sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO));
    })
});