import { assert, expect } from 'chai';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isOk } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service'
import { APIsWillSucceed, uniqueAviName, uniqueMegaName } from '../testUtil';
import { add_product, register_login, open_store, PAYMENT_INFO, SHIPPING_INFO } from './common';

describe('4.11: view store buying history', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
        APIsWillSucceed();
    });

    afterEach(function () {
        service.clear();
    });
    it('viwe store history',async function () {
        let avi_sessionId = await service.enter();
        let avi =await register_login(service,avi_sessionId, uniqueAviName(), "123456789");
        let store = await open_store(service,avi_sessionId, avi, uniqueMegaName(), 123456, "Tel Aviv");
        
        console.log("----------------------------------------------------------------------------------");
        let banana = await add_product(service,avi_sessionId, avi, store, "banana", [], 1, 50);
        let apple = await add_product(service,avi_sessionId, avi, store, "apple", [], 1, 10);
        await service.addProductTocart(avi_sessionId, store.getStoreId(), banana, 10);
        await service.addProductTocart(avi_sessionId, store.getStoreId(), apple, 7);
        await service.checkoutBasket(avi_sessionId, store.getStoreId(), "king Goerge st 42");
        await service.completeOrder(avi_sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO);
        await service.getStorePurchaseHistory(avi_sessionId, store.getStoreId())
    })
});