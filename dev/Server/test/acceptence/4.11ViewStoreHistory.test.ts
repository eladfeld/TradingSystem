import { assert, expect } from 'chai';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isOk } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service'
import { add_product, enter_register_login, open_store } from './common';

describe('4.11: view store buying history', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });
    it('viwe store history',async function () {
        let avi =await enter_register_login(service, "avi", "123456789");
        let store = await open_store(service, avi, "Mega", 123456, "Tel Aviv");
        
        console.log("----------------------------------------------------------------------------------");
        let banana = await add_product(service, avi, store, "banana", [], 1, 50);
        let apple = await add_product(service, avi, store, "apple", [], 1, 10);
        service.addProductTocart(avi.getUserId(), store.getStoreId(), banana, 10);
        service.addProductTocart(avi.getUserId(), store.getStoreId(), apple, 7);
        service.checkoutBasket(avi.getUserId(), store.getStoreId(), "king Goerge st 42");
        service.completeOrder(avi.getUserId(), store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address");
        service.getStorePurchaseHistory(avi.getUserId(), store.getStoreId())
        .then(_ => assert.ok)
        .catch(_ => assert.fail)
    })
});