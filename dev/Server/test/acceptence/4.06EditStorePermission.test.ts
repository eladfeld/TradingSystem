import { assert, expect } from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store } from './common';

describe('4.6: edit store permission', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });
    it('avi opens store and appoints manager with all the permissions', async function () {
        let avi_sessionId = await service.enter();
        let moshe_sessionId = await service.enter();
        let avi = await register_login(service,avi_sessionId, "avi", "123456789");
        let moshe = await register_login(service,moshe_sessionId, "moshe", "123456789");
        let store = await open_store(service,avi_sessionId, avi, "Mega", 123456, "Tel Aviv");
        service.appointStoreManager(avi_sessionId, store.getStoreId(), moshe.getUsername());
        service.getStoreStaff(moshe_sessionId, store.getStoreId())
        .then( _ => assert.fail)
        .catch( _ => assert.ok)
        service.editStaffPermission(avi_sessionId, moshe.getUserId(), store.getStoreId(), -1)
        .then( _ => assert.ok)
        .catch( _ => assert.fail)
    })

    it('moshe, a store manager tries to edit store inventory without permissions', async function () {
        let avi_sessionId = await service.enter();
        let moshe_sessionId = await service.enter();
        let avi = await register_login(service,avi_sessionId, "avi", "123456789");
        let moshe = await register_login(service,moshe_sessionId, "moshe", "123456789");
        let store = await open_store(service,avi_sessionId, avi, "Mega", 123456, "Tel Aviv");
        store.addCategoryToRoot('Sweet')
        service.appointStoreManager(avi_sessionId, store.getStoreId(), moshe.getUsername());
        service.addNewProduct(moshe_sessionId, store.getStoreId(), "banana", ['Sweet'], 15)
        .then(_ => assert.fail)
        .catch(_ => assert.ok)
    })
});