import {expect} from 'chai';
import { Appointment } from '../../src/DomainLayer/user/Appointment';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isOk, Result } from '../../src/Result';
import {Service} from '../../src/ServiceLayer/Service'

describe('2.4: login system test' , function() {

    it('user login' , function() {
        Authentication.clean();
        let service: Service = Service.get_instance();
        service.clear();
        let res:Result<number> = service.enter();
        if (isOk(res))
        {
            service.register("avi", "123456789");
            expect(isOk(service.login(res.value,"avi","123456789"))).to.equal(true);
        }
    })

    it('user false password login' , function() {
        let service: Service = Service.get_instance();
        service.clear();
        let res:Result<number> = service.enter();
        if (isOk(res))
        {
            service.register("avi", "123456789");
            expect(isOk(service.login(res.value,"avi","1234"))).to.equal(false);
        }
    })

    it('user false username login' , function() {
        let service: Service = Service.get_instance();
        service.clear();
        let res:Result<number> = service.enter();
        if (isOk(res))
        {
            service.register("avi", "123456789");
            expect(isOk(service.login(res.value,"yogev ha'melech","123456789"))).to.equal(false);
        }
    })


});