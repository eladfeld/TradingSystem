import { assert, expect } from 'chai';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { add_product, register_login, open_store } from './common';
import { APIsWillSucceed, failIfResolved, uniqueAlufHasportName, uniqueAviName, uniqueMegaName } from '../testUtil';

describe('4.1: edit store inventory', function () {
    var service: Service = Service.get_instance();
    beforeEach(function () {
        APIsWillSucceed();
    });

    afterEach(function () {
        //service.clear();
    });

    it('edit non existent product ',async function () {
        let sessionId = await service.enter();
        let avi =await register_login(service,sessionId, uniqueAviName(), "123456789")
        let store = await open_store(service,sessionId, avi, uniqueMegaName(), 123456, "Tel Aviv");
        await store.addCategoryToRoot('Sweet')
        let product1: Product = new Product("banana", ['Sweet']);
        failIfResolved(()=> service.editStoreInventory(sessionId, store.getStoreId(), product1.getProductId(), 10))
    })

    it('edit existing product', async function () {
        let sessionId = await service.enter();
        let avi = await register_login(service,sessionId, uniqueAviName(), "123456789")
        let store = await open_store(service,sessionId, avi, uniqueMegaName(), 123456, "Tel Aviv");
        await store.addCategoryToRoot('Sweet')
        let banana = await add_product(service,sessionId, avi, store, "banana", ['Sweet'], 12, 100);
        await service.editStoreInventory(sessionId, store.getStoreId(), banana, 10)
    })

});