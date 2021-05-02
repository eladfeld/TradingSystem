import { assert, expect } from 'chai';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { enter_register_login, open_store } from './common';

describe('4.3: Appoint Owner tests', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });
    it('avi opens store and appoints moshe to owner', function () {

        let avi = enter_register_login(service, "avi", "123456789")
        let moshe = enter_register_login(service, "moshe", "123456789")
        let store = open_store(service, avi, "Mega", 123456, "Tel Aviv");
        expect(isOk(service.appointStoreOwner(avi.getUserId(), store.getStoreId(), moshe.getUserId()))).to.equal(true);
    })

    it('moshe tries to appoint ali to owner without permissions', function () {
        let avi = enter_register_login(service, "avi", "123456789")
        let moshe = enter_register_login(service, "moshe", "123456789")
        let ali = enter_register_login(service, "ali", "123456789")
        let store = open_store(service,avi, "Mega", 123456, "Tel Aviv");
        service.appointStoreManager(avi.getUserId(), store.getStoreId(), moshe.getUserId());
        expect(isOk(service.appointStoreOwner(moshe.getUserId(), store.getStoreId(), ali.getUserId()))).to.equal(false);

    })

});