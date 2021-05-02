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
import { enter_register_login, open_store } from './common';

describe('2.9: buy products', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });
    it('buy shopping basket', function () {
        let avi = enter_register_login(service, "avi", "1234");
        let store = open_store(service, avi, "Mega", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let banana = service.addNewProduct(avi.getUserId(), store.getStoreId(), "banana", ['Sweet'], 1, 50);
        let apple = service.addNewProduct(avi.getUserId(), store.getStoreId(), "apple", ['Sweet'], 1, 10);
        if (isOk(banana) && isOk(apple)) {
            service.addProductTocart(avi.getUserId(), store.getStoreId(), banana.value, 10);
            service.addProductTocart(avi.getUserId(), store.getStoreId(), apple.value, 7);
            service.checkoutBasket(avi.getUserId(), store.getStoreId(), "king Goerge st 42");
            expect(isOk(service.completeOrder(avi.getUserId(), store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address"))).to.equal(true);
        }
    })


    it('try to buy too much items', function () {
        let avi = enter_register_login(service, "avi", "1234");
        let ali = enter_register_login(service, "ali", "1234");
        let store = open_store(service, avi, "Mega", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let banana = service.addNewProduct(avi.getUserId(), store.getStoreId(), "banana", ['Sweet'], 1, 50);
        if (isOk(banana)) {
            service.addProductTocart(avi.getUserId(), store.getStoreId(), banana.value, 40);
            service.addProductTocart(ali.getUserId(), store.getStoreId(), banana.value, 40);
            service.checkoutBasket(avi.getUserId(), store.getStoreId(), "king Goerge st 42");
            service.completeOrder(avi.getUserId(), store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address");
            expect(isOk(service.checkoutBasket(ali.getUserId(), store.getStoreId(), "king Goerge st 42"))).to.equal(false);
        }
    })
});