import { assert, expect } from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store } from './common';
import { APIsWillSucceed } from '../testUtil';

describe('4.9: get store staff', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
        APIsWillSucceed();
    });

    afterEach(function () {
        service.clear();
    });

    it('get staff', async function () {
        let moshe_sessionId = await service.enter();
        let avi_sessionId = await service.enter();
        let avi = await register_login(service,avi_sessionId, "avi", "123456789");
        let moshe = await register_login(service,moshe_sessionId, "moshe", "123456789");
        let store = await open_store(service,avi_sessionId, avi, "Mega", 123456, "Tel Aviv");

        service.appointStoreManager(avi_sessionId, store.getStoreId(), moshe.getUsername());
        service.getStoreStaff(avi_sessionId, store.getStoreId())
        .then(staffRes => {
            var staff = JSON.parse(staffRes);
            expect(staff['subscribers'].length).to.equal(2);
        })
        .catch(_ => assert.fail)
    })
});