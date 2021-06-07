import {expect} from 'chai';
import { isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed } from '../testUtil';

import {setReady, waitToRun} from '../testUtil';
describe('2.2: exit system test' ,async function() {

    var service : Service =await Service.get_instance();
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });

    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });

    it('guest user exit system' , async function() {
        let id: string  = await service.enter()
        let numUsers: number = service.get_logged_guest_users().size;
        service.exit(id);
        expect(service.get_logged_guest_users().size).to.equal(numUsers-1);           
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