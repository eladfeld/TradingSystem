import { assert, expect } from 'chai';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { add_product, enter_register_login, open_store } from './common';

describe('4.1: edit store inventory', function () {
    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });

    it('edit non existent product ',async function () {
        let avi =await enter_register_login(service, "avi", "123456789")
        let store = await open_store(service, avi, "Aluf Hasport", 123456, "Tel Aviv");
        store.addCategoryToRoot('Sweet')
        let product1: Product = new Product("banana", ['Sweet']);
        service.editStoreInventory(avi.getUserId(), store.getStoreId(), product1.getProductId(), 10)
        .then(_ => assert.fail)
        .catch(_ => assert.ok)
    })

    it('edit existing product', async function () {
        let avi = await enter_register_login(service, "avi", "123456789")
        let store = await open_store(service, avi, "Aluf Hasport", 123456, "Tel Aviv");
        store.addCategoryToRoot('Sweet')
        let banana = await add_product(service, avi, store, "banana", ['Sweet'], 12, 100);
        service.editStoreInventory(avi.getUserId(), store.getStoreId(), banana, 10)
        .then(_ => assert.ok)
        .catch(_ => assert.fail)
    })

});