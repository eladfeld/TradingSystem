import { expect } from 'chai';
import { DB } from '../../src/DataAccessLayer/DBfacade';
import Purchase from '../../src/DomainLayer/purchase/Purchase';
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store, SHIPPING_INFO, PAYMENT_INFO } from '../acceptence/common';
import {APIsWillSucceed, failIfResolved, uniqueAviName, uniqueMegaName} from '../testUtil';
import {setReady, waitToRun} from '../testUtil';


describe('Auth fail',function () {

   
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });


    it('fail on checkout', async function () {
        var service: Service =await Service.get_instance();
        let avi_sessionId = await service.enter()
        let avi = await register_login(service, avi_sessionId, uniqueAviName(), "1234");
        let store = await open_store(service, avi_sessionId, avi, uniqueMegaName(), 123456, "Tel aviv");
        await store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(avi_sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50,"");
        let apple = await service.addNewProduct(avi_sessionId, store.getStoreId(), "apple", ['Sweet'], 1, 10,"");
        await service.addProductTocart(avi_sessionId, store.getStoreId(), banana, 10);
        await service.addProductTocart(avi_sessionId, store.getStoreId(), apple, 7);
        DB.willFail();
        await failIfResolved(()=> service.checkoutBasket(avi_sessionId, store.getStoreId(), SHIPPING_INFO));
        await failIfResolved(()=> service.completeOrder(avi_sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO))
        DB.willSucceed();
        await service.checkoutBasket(avi_sessionId, store.getStoreId(), SHIPPING_INFO);
        let purchase_res = await service.completeOrder(avi_sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO)

        expect(purchase_res).to.equal(true)
        // check basktet updated successfully
        expect(avi.quantityInBasket(store.getStoreId(),banana)).to.equal(0)
        expect(avi.quantityInBasket(store.getStoreId(),apple)).to.equal(0)

        // check store inventory updated successfully
        expect(store.getProductQuantity(banana)).to.equal(40)
        expect(store.getProductQuantity(apple)).to.equal(3)
        
        // if transaction completed then the external systems were activated 
        await Purchase.getCompletedTransactionsForUser(avi.getUserId())
    })

    it('fail on completing order', async function () {
        var service: Service =await Service.get_instance();
        let avi_sessionId = await service.enter()
        let avi = await register_login(service, avi_sessionId, uniqueAviName(), "1234");
        let store = await open_store(service, avi_sessionId, avi, uniqueMegaName(), 123456, "Tel aviv");
        await store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(avi_sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50,"");
        let apple = await service.addNewProduct(avi_sessionId, store.getStoreId(), "apple", ['Sweet'], 1, 10,"");
        await service.addProductTocart(avi_sessionId, store.getStoreId(), banana, 10);
        await service.addProductTocart(avi_sessionId, store.getStoreId(), apple, 7);
        await service.checkoutBasket(avi_sessionId, store.getStoreId(), SHIPPING_INFO);
        DB.willFail();
        await failIfResolved(()=> service.completeOrder(avi_sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO))
        DB.willSucceed();
        let purchase_res = await service.completeOrder(avi_sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO)
        expect(purchase_res).to.equal(true)
        // check basktet updated successfully
        expect(avi.quantityInBasket(store.getStoreId(),banana)).to.equal(0)
        expect(avi.quantityInBasket(store.getStoreId(),apple)).to.equal(0)

        // check store inventory updated successfully
        expect(store.getProductQuantity(banana)).to.equal(40)
        expect(store.getProductQuantity(apple)).to.equal(3)
        
        // if transaction completed then the external systems were activated 
        await Purchase.getCompletedTransactionsForUser(avi.getUserId())
    })
   
});