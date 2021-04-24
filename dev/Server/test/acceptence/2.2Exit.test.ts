import {expect} from 'chai';
import { isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';

describe('2.2: exit system test' , function() {

    var service : Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function() {
        service.clear();
    });

    it('guest user exit system' , function() {
        let res  = service.enter()
        if(isOk(res) && service.get_logged_guest_users().length === 1)
        {
            service.exit(res.value);
            expect(service.get_logged_guest_users().length).to.equal(0);
        }
    })

    it('exit 3 users' , function() {
        let res1 = service.enter()
        let res2 = service.enter()
        let res3 = service.enter()
        if(isOk(res1) && isOk(res2) && isOk(res3) && service.get_logged_guest_users().length === 3)
        {
            service.exit(res1.value);
            service.exit(res1.value);
            expect(service.get_logged_guest_users().length === 1);

        }   
    })

});