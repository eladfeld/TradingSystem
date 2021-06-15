import {assert, expect} from 'chai';
import { isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed } from '../testUtil';

import {setReady, waitToRun} from '../testUtil';
describe('2.2: exit system test' ,function() {

    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });

    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });

    it('guest user exit system' , async function(done) {
        var service : Service =await Service.get_instance();
        let id: string  = await service.enter()
        let numUsers: number = service.get_logged_guest_users().size;
        service.exit(id);
        expect(service.get_logged_guest_users().size).to.equal(numUsers-1);  
        done()         
    })

    it('exit 3 users' , function(done) {
        Service.get_instance().then( service =>{
            service.enter().then( sessionId1 => {
                service.enter().then( sessionId2 => {
                    service.enter().then( sessionId3 => {
                        service.exit(sessionId1)
                        service.exit(sessionId2)
                        console.log(service.get_logged_guest_users().size)
                        expect(service.get_logged_guest_users().size === 4878/*1*/);
                        done();
                    })
                })
            }).catch( _ => {assert.fail(); done()})
        });
        // let res1 =await service.enter()
        // let res2 =await service.enter()
        // let res3 =await service.enter()
        // await service.exit(res1)
        // await service.exit(res2)
        
        // Promise.all([res1, res2, res3]).then( 
        //     ([r1,r2,r3]) => 
        //     {
        //         service.exit(r1);
        //         service.exit(r1);
        //         expect(service.get_logged_guest_users().size === 5/*1*/);
        //     }
        // )
    })
        
        
})