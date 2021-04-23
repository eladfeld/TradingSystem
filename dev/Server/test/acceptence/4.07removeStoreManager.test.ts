import { assert, expect } from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service';
import { enter_register_login, open_store } from './common';

describe('4.7: remove appointment', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
        Authentication.clean();
    });
    it('remove recursive appointment', function () {
        let avi = enter_register_login(service, "avi", "123456789");
        let moshe = enter_register_login(service, "moshe", "123456789");
        let hezi = enter_register_login(service, "hezi", "123456789");
        let store = open_store(service, avi, "Mega", 123456, "Tel Aviv");


        service.appointStoreOwner(avi.getUserId(), store.getStoreId(), moshe.getUserId());
        service.appointStoreManager(moshe.getUserId(), store.getStoreId(), hezi.getUserId());
        service.deleteManagerFromStore(avi.getUserId(), moshe.getUserId(), store.getStoreId())
        expect(store.getAppointments().length).to.equal(1);
    })

    it('try to remove manager without permission', function () {
        let avi = enter_register_login(service, "avi", "123456789");
        let moshe = enter_register_login(service, "moshe", "123456789");
        let store = open_store(service, avi, "Mega", 123456, "Tel Aviv");
        service.appointStoreManager(avi.getUserId(), store.getStoreId(), moshe.getUserId());
        expect(isOk(service.deleteManagerFromStore(moshe.getUserId(), avi.getUserId(), store.getStoreId()))).to.equal(false);

    })





});