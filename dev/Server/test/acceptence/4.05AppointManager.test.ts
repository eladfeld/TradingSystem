import { assert, expect } from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { enter_register_login, open_store } from './common';

describe('4.5:Appoint manager tests', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });
    it('avi opens store and appoints moshe to manager', async function () {

        let avi = await enter_register_login(service, "avi", "123456789");
        let moshe = await enter_register_login(service, "moshe", "123456789");
        let store = await open_store(service, avi, "Mega", 123456, "Tel Aviv");
        service.appointStoreManager(avi.getUserId(), store.getStoreId(), moshe.getUserId())
        .then(_ => assert.ok)
        .catch(_ => assert.fail)
    })

    it('moshe, a store manager tries to edit store inventory without permissions', async function () {
        let avi = await enter_register_login(service, "avi", "123456789")
        let moshe = await enter_register_login(service, "moshe", "123456789")
        let store = await open_store(service, avi, "Mega", 123456, "Tel Aviv");
        service.appointStoreManager(avi.getUserId(), store.getStoreId(), moshe.getUserId());
        store.addCategoryToRoot('Sweet')
        service.addNewProduct(moshe.getUserId(), store.getStoreId(), "banana", ['Sweet'], 15)
        .then(_ => assert.fail)
        .catch(_ => assert.ok)
    })
});