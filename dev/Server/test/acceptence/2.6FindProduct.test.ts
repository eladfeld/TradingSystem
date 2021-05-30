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
import { register_login, open_store } from './common';

describe('2.6: find product', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
        //Authentication.clean();
    });
    it('find product by name', async function () {
        let sessionId = await service.enter();
        let avi = await register_login(service,sessionId,"avi","123456");
        let store =await open_store(service,sessionId,avi,"Mega",123456,"Tel Aviv");
        store.addCategoryToRoot('Food')
        let banana = service.addNewProduct(sessionId, store.getStoreId(), "banana", ['Food'], 156, 50);
        let apple = service.addNewProduct(sessionId, store.getStoreId(), "apple", ['Food'], 1, 10);
        service.getPruductInfoByName(sessionId, "banana")
        .then(products => expect(JSON.parse(products)['products'].length).to.equal(1))
        .catch(assert.fail)
    })

    it('find product by category', async function () {
        let sessionId = await service.enter();
        let avi = await register_login(service,sessionId, "avi", "1234");
        let store =await open_store(service,sessionId,avi,"Mega",123465,"Tel Aviv");
        store.addCategoryToRoot('Sweet')
        store.addCategoryToRoot('Sport')
        store.addCategoryToRoot('Electric')
        let banana = service.addNewProduct(sessionId, store.getStoreId(), "banana", ['Sweet'], 156, 50);
        let apple = service.addNewProduct(sessionId, store.getStoreId(), "apple", ['Sweet'], 1, 10);
        let ball = service.addNewProduct(sessionId, store.getStoreId(), "ball", ['Sport'], 3, 44);
        let pc = service.addNewProduct(sessionId, store.getStoreId(), "pc", ['Electric'], 2442, 123);
        service.getPruductInfoByCategory(sessionId, 'Sweet')
        .then(products => expect(JSON.parse(products)['products'].length).to.equal(2))
        .catch(assert.fail)
    })
});