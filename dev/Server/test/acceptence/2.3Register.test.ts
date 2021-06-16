import {assert, expect} from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed, uniqueAviName } from '../testUtil';
import {setReady, waitToRun} from '../testUtil';
import { truncate_tables } from '../../src/DataAccessLayer/connectDb';

describe('2.3: register test' , function() {

    beforeEach( () => {
        return waitToRun(()=>APIsWillSucceed());
    });

    afterEach(async function () {
        setReady(true);
    });

    it('guest user register' ,async function() {
        this.timeout(100000)
        var service : Service = await Service.get_instance();

        const aviName = uniqueAviName();
        try{
            await service.register(aviName, "123456789",13)
        }
        catch(e){
            console.log(JSON.stringify(e))
            assert.fail(e)
        }
    })

    it('register with the same username' ,async function() {
        this.timeout(100000)
        var service : Service = await Service.get_instance();

        const aviName = uniqueAviName();
        service.register(aviName, "123456789",13);
        try{
            await service.register(aviName, "1234",13);
            assert.fail("sohuld be able to register twice")
        }
        catch(e){
            //this is ok should throw 
        }

    })


});