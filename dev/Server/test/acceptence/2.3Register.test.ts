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
        //console.log('start')
        this.timeout(10000)
        return waitToRun(()=>APIsWillSucceed());
    });

    afterEach(async function () {
        //console.log('finish');     
        await truncate_tables()   
        setReady(true);
    });

    it('guest user register' ,async function() {
        var service : Service = await Service.get_instance();

        const aviName = uniqueAviName();
        let register = service.register(aviName, "123456789",13)
        register.then ( _ => {assert.ok(1)})
        .catch( _ => assert.fail())
    })

    it('register with the same username' ,async function() {
        var service : Service = await Service.get_instance();

        const aviName = uniqueAviName();
        service.register(aviName, "123456789",13);
        let register = service.register(aviName, "1234",13);
        register.then( _ => {assert.fail()})
        .catch(_ => {assert.ok("")})
    })


});