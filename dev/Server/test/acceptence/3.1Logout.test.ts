import {assert, expect} from 'chai';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { enter_login } from './common';

describe('3.1: Logout' , function() {
    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });

    it('good logout' , function(){
        let sys_manager = enter_login(service , "michael" , "1234");
        expect(service.get_logged_system_managers().length).to.equal(1);
        service.logout(sys_manager.getUserId())
        expect(service.get_logged_system_managers().length).to.equal(0);
    });

    it('system manager tries to open store store after logout' , function(){
        let sys_manager = enter_login(service , "michael" , "1234");
        service.logout(sys_manager.getUserId());
        expect(isOk(service.openStore(sys_manager.getUserId() , "aluf Hasport" , 123456 , "Tel Aviv"))).to.equal(false);
    });
});