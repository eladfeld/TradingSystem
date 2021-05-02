import {expect} from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';

describe('2.3: register test' , function() {

    var service : Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function() {
        service.clear();
    });

    it('guest user register' , function() {
        expect(isOk(service.register("avi", "123456789"))).to.equal(true);
    })

    it('register with the same username' , function() {
        service.register("avi", "123456789");
        expect(isOk(service.register("avi", "1234"))).to.equal(false); 
    })


});