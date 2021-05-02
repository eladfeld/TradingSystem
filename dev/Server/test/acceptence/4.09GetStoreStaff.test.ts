import { assert, expect } from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { enter_register_login, open_store } from './common';

describe('4.9: get store staff', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });

    it('get staff', function () {
        let avi = enter_register_login(service, "avi", "123456789");
        let moshe = enter_register_login(service, "moshe", "123456789");
        let store = open_store(service, avi, "Mega", 123456, "Tel Aviv");

        service.appointStoreManager(avi.getUserId(), store.getStoreId(), moshe.getUserId());
        let staffRes: Result<string> = service.getStoreStaff(avi.getUserId(), store.getStoreId());
        if (isOk(staffRes)) {
            var staff = JSON.parse(staffRes.value);
            expect(staff['subscribers'].length).to.equal(2);
        }
        else assert.fail();


    })
});