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
import { enter_register_login, open_store } from './common';

describe('2.6: find product', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
        Authentication.clean();
    });
    it('find product by name', function () {
        let avi = enter_register_login(service,"avi","123456");
        let store = open_store(service,avi,"Mega",123456,"Tel Aviv");
        store.addCategoryToRoot('Food')
        let banana = service.addNewProduct(avi.getUserId(), store.getStoreId(), "banana", ['Food'], 156, 50);
        let apple = service.addNewProduct(avi.getUserId(), store.getStoreId(), "apple", ['Food'], 1, 10);
        let products: Result<string> = service.getPruductInfoByName(avi.getUserId(), "banana")
        if (isOk(products)) {
            expect(JSON.parse(products.value)['products'].length).to.equal(1);
        }
    })

    it('find product by category', function () {
        let avi = enter_register_login(service, "avi", "1234");
        let store = open_store(service,avi,"Mega",123465,"Tel Aviv");
        store.addCategoryToRoot('Sweet')
        store.addCategoryToRoot('Sport')
        store.addCategoryToRoot('Electric')
        let banana = service.addNewProduct(avi.getUserId(), store.getStoreId(), "banana", ['Sweet'], 156, 50);
        let apple = service.addNewProduct(avi.getUserId(), store.getStoreId(), "apple", ['Sweet'], 1, 10);
        let ball = service.addNewProduct(avi.getUserId(), store.getStoreId(), "ball", ['Sport'], 3, 44);
        let pc = service.addNewProduct(avi.getUserId(), store.getStoreId(), "pc", ['Electric'], 2442, 123);
        let products: Result<string> = service.getPruductInfoByCategory(avi.getUserId(), 'Sweet');
        if (isOk(products)) {
            expect(JSON.parse(products.value)['products'].length).to.equal(2);
        }
    })
});