import {assert, expect} from 'chai';
import { isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed } from '../testUtil';

describe('2.1: enter system test' , function() {

    var service : Service = Service.get_instance();
    beforeEach(function () {
        APIsWillSucceed();
    });

    afterEach(function() {
        //service.clear();
    });
    
    it('guest user enter system' , function() {
        let res: Promise<string> = service.enter()
        res.then( id => {
            assert.ok(1);
        })
    })

    it('enter 3 users' , function() {
        let res1: Promise<string> = service.enter()
        let res2: Promise<string> = service.enter()
        let res3: Promise<string> = service.enter()
        Promise.all([res1,res2,res3]).then ( ([r1, r2, r3])=> {
            expect(r1 !== r2 && r1!==r3 && r2!==r3);
        })
    })

    describe('exit system test' , function() {
        it('enter 3 users and exit 1' , function() {
            let res1: Promise<string> = service.enter()
            let res2: Promise<string> = service.enter()
            let res3: Promise<string> = service.enter()
            Promise.all([res1,res2,res3]).then( ([r1,r2,r3]) =>
            {
                service.exit(r2);
                expect(service.get_logged_guest_users().size).to.equal(2);
            })
        })

        it('fail exit' , async function() {
            await service.enter();
            service.exit("5");
            expect(service.get_logged_guest_users().size).to.equal(1);
            
        })

    })

});