import {assert, expect} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { register_login } from './common';
import { APIsWillSucceed, failIfResolved, uniqueAlufHasportName, uniqueAviName } from '../testUtil';
import {setReady, waitToRun} from '../testUtil';

describe('3.2: open store test' , function() {

    
    beforeEach( () => {
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        setReady(true);
    });

    it('open store good' ,async function() {
        this.timeout(100000)
        var service: Service =await Service.get_instance();
        let sessionId = await service.enter()
        let avi =await register_login(service,sessionId, uniqueAviName(), "123456789");
        await service.openStore(sessionId , uniqueAlufHasportName() , 123456 , "Tel Aviv" );
    })

    it('open store with non exist subscriber' ,async function() {
        this.timeout(100000)
        var service: Service =await Service.get_instance();
        let sessionId = await service.enter()
        let avi =await register_login(service,sessionId, uniqueAviName(), "123456789");
        await failIfResolved(()=> service.openStore(sessionId + 1 , uniqueAlufHasportName() , 123456 , "Tel Aviv" ));

    })

});