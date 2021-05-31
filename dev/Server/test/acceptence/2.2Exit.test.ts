import {expect} from 'chai';
import { isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed } from '../testUtil';

describe('2.2: exit system test' , function() {

    var service : Service = Service.get_instance();
    beforeEach(function () {
        APIsWillSucceed();
    });

    afterEach(function() {
        service.clear();
    });

    it('guest user exit system' , function() {
        let res  = service.enter()
        res.then(
            id=>
            {
                service.exit(id);
                expect(service.get_logged_guest_users().size).to.equal(0);   
            }
        )
    })

    it('exit 3 users' , function() {
        let res1 = service.enter()
        let res2 = service.enter()
        let res3 = service.enter()
        Promise.all([res1, res2, res3]).then( 
            ([r1,r2,r3]) => 
            {
                service.exit(r1);
                service.exit(r1);
                expect(service.get_logged_guest_users().size === 1);
            }
        )
    })
        
        
})