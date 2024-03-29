import { assert, expect } from 'chai';
import PaymentSystem from '../../src/DomainLayer/apis/PaymentSystem';
import SupplySystem from '../../src/DomainLayer/apis/SupplySystem';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import Purchase from '../../src/DomainLayer/purchase/Purchase';
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store, SHIPPING_INFO, PAYMENT_INFO } from '../acceptence/common';
import {APIsWillSucceed, failIfResolved, uniqueAviName, uniqueMegaName} from '../testUtil';
import {setReady, waitToRun} from '../testUtil';

describe('API fail', function () {

    var service: Service = Service.get_instance();
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });
    it('buy shopping basket with payment system down', async function () {
        SupplySystem.willSucceed();
        PaymentSystem.willFail();
        let avi_sessionId = await service.enter()
        let avi = await register_login(service, avi_sessionId, uniqueAviName(), "1234");
        let store = await open_store(service, avi_sessionId, avi, uniqueMegaName(), 123456, "Tel aviv");
        await store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(avi_sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50);
        let apple = await service.addNewProduct(avi_sessionId, store.getStoreId(), "apple", ['Sweet'], 1, 10);
        await service.addProductTocart(avi_sessionId, store.getStoreId(), banana, 10);
        await service.addProductTocart(avi_sessionId, store.getStoreId(), apple, 7);
        await service.checkoutBasket(avi_sessionId, store.getStoreId(), SHIPPING_INFO);
        await failIfResolved(()=>service.completeOrder(avi_sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO))
        PaymentSystem.willSucceed();
        await service.completeOrder(avi_sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO)
    })
   
});