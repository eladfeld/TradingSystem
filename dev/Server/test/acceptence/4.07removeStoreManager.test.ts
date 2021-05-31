import { assert, expect } from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed } from '../testUtil';
import { register_login, open_store } from './common';

describe('4.7: remove appointment', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
        APIsWillSucceed();
    });

    afterEach(function () {
        service.clear();
    });
    it('remove recursive appointment',async function () {
        let avi_sessionId = await service.enter();
        let moshe_sessionId = await service.enter();
        let hezi_sessionId = await service.enter();

        let avi =await register_login(service,avi_sessionId, "avi", "123456789");
        let moshe =await register_login(service,moshe_sessionId, "moshe", "123456789");
        let hezi =await register_login(service,hezi_sessionId, "hezi", "123456789");
        let store =await open_store(service,avi_sessionId, avi, "Mega", 123456, "Tel Aviv");


        service.appointStoreOwner(avi_sessionId, store.getStoreId(), moshe.getUsername());
        service.appointStoreManager(moshe_sessionId, store.getStoreId(), hezi.getUsername());
        service.deleteManagerFromStore(avi_sessionId, moshe.getUserId(), store.getStoreId())
        expect(store.getAppointments().length).to.equal(1);
    })

    it('try to remove manager without permission',async function () {
        let avi_sessionId = await service.enter();
        let moshe_sessionId = await service.enter();
        let avi =await register_login(service,avi_sessionId, "avi", "123456789");
        let moshe =await register_login(service,moshe_sessionId, "moshe", "123456789");
        let store =await open_store(service,avi_sessionId, avi, "Mega", 123456, "Tel Aviv");
        service.appointStoreManager(avi_sessionId, store.getStoreId(), moshe.getUsername());
        service.deleteManagerFromStore(moshe_sessionId, avi.getUserId(), store.getStoreId())
        .then(_ => assert.fail())
        .catch( _ => assert.ok(""))
    })





});