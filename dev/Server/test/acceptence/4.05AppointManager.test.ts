import { assert, expect } from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store } from './common';
import { APIsWillSucceed, failIfResolved, uniqueAviName, uniqueMegaName, uniqueMosheName } from '../testUtil';

describe('4.5:Appoint manager tests', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
        APIsWillSucceed();
    });

    afterEach(function () {
        //service.clear();
    });
    it('avi opens store and appoints moshe to manager', async function () {
        let avi_sessionId = await service.enter();
        let moshe_sessionId = await service.enter();
        let avi = await register_login(service,avi_sessionId, uniqueAviName(), "123456789");
        let moshe = await register_login(service,moshe_sessionId, uniqueMosheName(), "123456789");
        let store = await open_store(service, avi_sessionId,avi, uniqueMegaName(), 123456, "Tel Aviv");
        await service.appointStoreManager(avi_sessionId, store.getStoreId(), moshe.getUsername())
    })

    it('moshe, a store manager tries to edit store inventory without permissions', async function () {
        let avi_sessionId = await service.enter();
        let moshe_sessionId = await service.enter();
        let avi = await register_login(service,avi_sessionId, uniqueAviName(), "123456789")
        let moshe = await register_login(service,moshe_sessionId, uniqueMosheName(), "123456789")
        let store = await open_store(service, avi_sessionId, avi, uniqueMegaName(), 123456, "Tel Aviv");
        await service.appointStoreManager(avi_sessionId, store.getStoreId(), moshe.getUsername());
        await store.addCategoryToRoot('Sweet')
        await failIfResolved(()=> service.addNewProduct(moshe_sessionId, store.getStoreId(), "banana", ['Sweet'], 15))
    })
});