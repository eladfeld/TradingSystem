import {assert, expect} from 'chai';
import { isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed } from '../testUtil';

import {setReady, waitToRun} from '../testUtil';
import { truncate_tables } from '../../src/DataAccessLayer/connectDb';
describe('2.2: exit system test' ,function() {

    beforeEach( () => {
        
        return waitToRun(()=>APIsWillSucceed());
    });

    afterEach(async function () {
        setReady(true);
    });

    it('guest user exit system' , async function() {
        this.timeout(100000)
        var service : Service =await Service.get_instance();
        let id: string  = await service.enter()
        let numUsers: number = service.get_logged_guest_users().size;
        service.exit(id);
        expect(service.get_logged_guest_users().size).to.equal(numUsers-1);  
    })

    it('exit 3 users' ,async function() {
        this.timeout(100000)
        let service = await Service.get_instance()
        let res1 =await service.enter()
        let res2 =await service.enter()
        let res3 =await service.enter()
        await service.exit(res1)
        await service.exit(res2)
        
        service.exit(res1);
        service.exit(res2);
        let size = service.get_logged_guest_users().size
        expect(service.get_logged_guest_users().size).to.equal(1);
    })
        
        
})