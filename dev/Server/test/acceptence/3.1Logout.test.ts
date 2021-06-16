import {assert, expect} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { enter_login } from './common';
import { APIsWillSucceed, uniqueAlufHasportName, uniqueName } from '../testUtil';
import {setReady, waitToRun} from '../testUtil';

describe('3.1: Logout' ,function() {
    
    beforeEach( () => {
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        setReady(true);
    });

    it('good logout' ,async function(){
        this.timeout(100000)
        var service: Service =await Service.get_instance();
        let michaelName = uniqueName("michael");
        let sessionId = await service.enter()
        await service.register(michaelName,"1234",20)
        let sys_manager =await service.login(sessionId , michaelName, "1234");
        let num_of_logged_users = service.get_logged_system_managers().size
        await service.logout(sessionId)
        expect(service.get_logged_system_managers().size).to.equal(num_of_logged_users-1);
    });

    it('system manager tries to open store store after logout' ,async function(){
        this.timeout(100000)
        var service: Service =await Service.get_instance();
        let michaelName = uniqueName("michael");
        let sessionId = await service.enter()
        await service.register(michaelName,"1234",20)
        let sys_manager =await service.login(sessionId , michaelName , "1234");
        await service.logout(sessionId);
        try{
        let promise =await service.openStore(sessionId , uniqueAlufHasportName() , 123456 , "Tel Aviv");
            assert.fail("open store should have failed")}
        catch{
            assert.ok("open store failed (and should have}")
        }
    });
});