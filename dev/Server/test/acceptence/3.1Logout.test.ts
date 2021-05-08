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

    it('good logout' ,async function(){
        let sessionId = await service.enter()
        let sys_manager =await service.login(sessionId , "michael" , "1234");
        let num_of_logged_users = service.get_logged_system_managers().size
        service.logout(sessionId)
        expect(service.get_logged_system_managers().size).to.equal(num_of_logged_users-1);
    });

    it('system manager tries to open store store after logout' ,async function(){
        let sessionId = await service.enter()
        let sys_manager =await service.login(sessionId , "michael" , "1234");
        service.logout(sessionId);
        let promise = service.openStore(sessionId , "aluf Hasport" , 123456 , "Tel Aviv");
        promise.catch(reason => { assert.ok("open store failed (and should have}")}).
        then( value => {assert.fail("open store should have failed")})
    });
});