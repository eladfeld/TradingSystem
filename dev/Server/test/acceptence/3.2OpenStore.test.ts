import {expect} from 'chai';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { enter_register_login } from './common';

describe('3.2: open store test' , function() {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });

    it('open store good' , function() {
        let avi = enter_register_login(service, "avi", "123456789");
        expect(isOk(service.openStore(avi.getUserId() , "Aluf Hasport" , 123456 , "Tel Aviv" ))).to.equal(true);
    })

    it('open store with non exist subscriber' , function() {
        let avi = enter_register_login(service, "avi", "123456789");
        expect(isOk(service.openStore(avi.getUserId() + 1 , "Aluf Hasport" , 123456 , "Tel Aviv" ))).to.equal(false);
    })

});