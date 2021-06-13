import {assert, expect} from 'chai';
import { isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed, failIfRejected,  } from '../testUtil';
import {setReady, waitToRun} from '../testUtil';
import { truncate_tables } from '../../src/DataAccessLayer/connectDb';

describe('2.1: enter system test' ,function() {

    
    beforeEach( () => {
        //console.log('start')
        this.timeout(10000)
        return waitToRun(()=>APIsWillSucceed());
    });

    afterEach(async function () {
        //console.log('finish');     
        await truncate_tables()   
        setReady(true);
    });
    
    it('guest user enter system' , async function() {
        var service : Service =await Service.get_instance();
        await failIfRejected(()=> service.enter())
    })

    it('enter 3 users' , async function() {
        var service : Service =await Service.get_instance();
        let res1: string = await service.enter()
        let res2: string = await service.enter()
        let res3: string = await service.enter()
        expect(res1 !== res2 && res1!==res3 && res2!==res3);
    })

    describe('exit system test' , function() {
        
        it('enter 3 users and exit 1' , async function() {
            var service : Service =await Service.get_instance();
            let res1: string = await service.enter()
            let res2: string = await service.enter()
            let res3: string = await service.enter()
            let numUsers: number = service.get_logged_guest_users().size;
            service.exit(res2);
            expect(service.get_logged_guest_users().size).to.equal(numUsers-1);
        })

        it('fail exit' , async function() {
            var service : Service =await Service.get_instance();
            await service.enter();
            let numUsers: number = service.get_logged_guest_users().size;
            service.exit("5");
            expect(service.get_logged_guest_users().size).to.equal(numUsers);            
        })

    })

});