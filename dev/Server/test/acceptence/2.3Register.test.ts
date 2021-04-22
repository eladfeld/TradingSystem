import {expect} from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';

describe('2.3: register test' , function() {

    it('guest user register' , function() {
        Authentication.clean();
        let service: Service = Service.get_instance();
        service.clear();
        expect(isOk(service.register("avi", "123456789"))).to.equal(true);
    })

    it('register with the same username' , function() {
        Authentication.clean();
        let service: Service = Service.get_instance();
        service.clear();
        service.register("avi", "123456789");
        expect(isOk(service.register("avi", "1234"))).to.equal(false); 
    })


});