import { assert, expect } from 'chai';
import { servicesVersion } from 'typescript';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import Purchase from '../../src/DomainLayer/purchase/Purchase';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store } from './common';

describe('2.9: buy products', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });
    it('buy shopping basket',async function () {
        let sessionId = await service.enter()
        let avi =await register_login(service,sessionId, "avi", "1234");
        let store = await open_store(service,sessionId, avi, "Mega", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50);
        let apple = await service.addNewProduct(sessionId, store.getStoreId(), "apple", ['Sweet'], 1, 10);
        service.addProductTocart(sessionId, store.getStoreId(), banana, 10);
        service.addProductTocart(sessionId, store.getStoreId(), apple, 7);
        service.checkoutBasket(sessionId, store.getStoreId(), "king Goerge st 42");
        service.completeOrder(sessionId, store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address")
        .then(_ => assert.ok)
        .catch(_ => assert.fail)
    })


    it('try to buy too much items',async function () {
        let sessionId = await service.enter()
        let avi =await register_login(service,sessionId, "avi", "1234");
        let ali =await register_login(service,sessionId, "ali", "1234");
        let store = await open_store(service,sessionId, avi, "Mega", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let banana =await  service.addNewProduct(sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50);
        service.addProductTocart(sessionId, store.getStoreId(), banana, 40);
        service.addProductTocart(sessionId, store.getStoreId(), banana, 40);
        service.checkoutBasket(sessionId, store.getStoreId(), "king Goerge st 42");
        service.completeOrder(sessionId, store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address");
        service.checkoutBasket(sessionId, store.getStoreId(), "king Goerge st 42")
        .then(_ => assert.fail)
        .catch(_ => assert.ok)
    })
});