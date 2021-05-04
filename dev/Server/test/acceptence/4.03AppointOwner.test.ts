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
    it('avi opens store and appoints moshe to owner',async function () {

        let avi =await enter_register_login(service, "avi", "123456789")
        let moshe =await enter_register_login(service, "moshe", "123456789")
        let store = await open_store(service, avi, "Mega", 123456, "Tel Aviv");
        service.appointStoreOwner(avi.getUserId(), store.getStoreId(), moshe.getUserId())
        .then(_ => assert.ok)
        .catch( _ => assert.fail)
    })

    it('moshe tries to appoint ali to owner without permissions',async function () {
        let avi =await enter_register_login(service, "avi", "123456789")
        let moshe =await enter_register_login(service, "moshe", "123456789")
        let ali =await enter_register_login(service, "ali", "123456789")
        let store = await open_store(service,avi, "Mega", 123456, "Tel Aviv");
        service.appointStoreManager(avi.getUserId(), store.getStoreId(), moshe.getUserId());
        service.appointStoreOwner(moshe.getUserId(), store.getStoreId(), ali.getUserId())
        .then(_ => assert.ok)
        .catch( _ => assert.fail)
    })

});