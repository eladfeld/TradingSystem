import {assert, expect} from 'chai';
import { Appointment } from '../../src/DomainLayer/user/Appointment';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed, check, uniqueAviName, uniqueName} from '../testUtil';
import {setReady, waitToRun} from '../testUtil';
import { truncate_tables } from '../../src/DataAccessLayer/connectDb';

describe('2.4: login system test' ,function() {

    

    beforeEach( () => {
        this.timeout(10000)
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });

    afterEach(async function () {
        //console.log('finish');    
        await truncate_tables()    
        setReady(true);
    });

    it('user login' ,async function() {
        var service : Service =await Service.get_instance();
        const aviName = uniqueAviName();
        let id =await service.enter();
        await service.register(aviName, "123456789",13);
        let subscriber = service.login(id,aviName,"123456789");
        subscriber.then( value => {assert.ok("login suceeded")})
        .catch( reason => {assert.fail("failed test")})
    })

    it('user false password login' ,async function() {
        var service : Service =await Service.get_instance();
        const aviName = uniqueAviName();
        let id =await service.enter();
        await service.register(aviName, "123456789",13);
        let subscriber = service.login(id,aviName,"1234")
        subscriber.
        then( _=> {
            assert.fail("login should fail")
            })
        .catch( reason => {
            assert.ok(1)
            })
    })

    it('user false username login' ,async function() {
        var service : Service =await Service.get_instance();
        const aviName = uniqueAviName();
        let id =await service.enter();
        await service.register(aviName, "123456789",13);
        try {
        let subscriber =await service.login(id, "yogev ha'melech","123456789");
        assert.fail("should throw exception")
        } catch {
            console.log("in catch")
            assert.ok(1)
        }
    });

});