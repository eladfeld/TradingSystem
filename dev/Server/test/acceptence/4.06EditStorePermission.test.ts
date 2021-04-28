import { assert, expect } from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { enter_register_login, open_store } from './common';

describe('4.6: edit store permission', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
        Authentication.clean();
    });
    it('avi opens store and appoints manager with all the permissions', function () {
        let avi = enter_register_login(service, "avi", "123456789");
        let moshe = enter_register_login(service, "moshe", "123456789");
        let store = open_store(service, avi, "Mega", 123456, "Tel Aviv");
        service.appointStoreManager(avi.getUserId(), store.getStoreId(), moshe.getUserId());
        expect(isOk(service.getStoreStaff(moshe.getUserId(), store.getStoreId()))).to.equal(false);
        service.editStaffPermission(avi.getUserId(), moshe.getUserId(), store.getStoreId(), -1);
        expect(isOk(service.getStoreStaff(moshe.getUserId(), store.getStoreId()))).to.equal(true);
    })

    it('moshe, a store manager tries to edit store inventory without permissions', function () {
        let avi = enter_register_login(service, "avi", "123456789");
        let moshe = enter_register_login(service, "moshe", "123456789");
        let store = open_store(service, avi, "Mega", 123456, "Tel Aviv");
        store.addCategoryToRoot('Sweet')
        service.appointStoreManager(avi.getUserId(), store.getStoreId(), moshe.getUserId());
        expect(isOk(service.addNewProduct(moshe.getUserId(), store.getStoreId(), "banana", ['Sweet'], 15))).to.equal(false);
    })
});