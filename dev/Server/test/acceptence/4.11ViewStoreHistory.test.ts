import { assert, expect } from 'chai';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isOk } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service'
import { APIsWillSucceed } from '../testUtil';
import { add_product, register_login, open_store } from './common';

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
        let avi =await register_login(service,avi_sessionId, "avi", "123456789");
        let store = await open_store(service,avi_sessionId, avi, "Mega", 123456, "Tel Aviv");
        
        console.log("----------------------------------------------------------------------------------");
        let banana = await add_product(service,avi_sessionId, avi, store, "banana", [], 1, 50);
        let apple = await add_product(service,avi_sessionId, avi, store, "apple", [], 1, 10);
        service.addProductTocart(avi_sessionId, store.getStoreId(), banana, 10);
        service.addProductTocart(avi_sessionId, store.getStoreId(), apple, 7);
        service.checkoutBasket(avi_sessionId, store.getStoreId(), "king Goerge st 42");
        service.completeOrder(avi_sessionId, store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address");
        service.getStorePurchaseHistory(avi_sessionId, store.getStoreId())
        .then(_ => assert.ok(""))
        .catch(_ => assert.fail())
    })
});