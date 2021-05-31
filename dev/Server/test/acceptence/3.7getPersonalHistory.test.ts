import { assert, expect } from 'chai';
import { servicesVersion } from 'typescript';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import Purchase from '../../src/DomainLayer/purchase/Purchase';
import Transaction from '../../src/DomainLayer/purchase/Transaction';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { add_product, register_login, open_store, PAYMENT_INFO, SHIPPING_INFO } from './common';
import { APIsWillSucceed, uniqueAviName, uniqueMegaName } from '../testUtil';

describe('3.7: get subscriber history', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
        APIsWillSucceed();
    });

    afterEach(function () {
        //service.clear();
    });

    it('get personal purchase history',async function () {
        let sessionId = await service.enter()
        let avi =await register_login(service,sessionId, uniqueAviName(), "1234");
        let store = await open_store(service,sessionId, avi, uniqueMegaName(), 123456, "Tel aviv");
        await store.addCategoryToRoot('Sweet')
        let banana = await add_product(service,sessionId, avi, store, "banana", ['Sweet'], 1, 50);
        let apple = await add_product(service,sessionId, avi, store, "apple", ['Sweet'], 1, 10);
        await service.addProductTocart(sessionId, store.getStoreId(), banana, 10);
        await service.addProductTocart(sessionId, store.getStoreId(), apple, 7);
        await service.checkoutBasket(sessionId, store.getStoreId(), "king Goerge st 42");
        await service.completeOrder(sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO);
        let historyRes = await service.getMyPurchaseHistory(sessionId);
        let history = JSON.parse(historyRes);
        expect(history.length).to.equal(1);
    })
});