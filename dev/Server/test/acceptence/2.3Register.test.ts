import {assert, expect} from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed, uniqueAviName } from '../testUtil';

describe('2.3: register test' , function() {

    var service : Service = Service.get_instance();
    beforeEach(function () {
        APIsWillSucceed();
    });

    afterEach(function() {
        //service.clear();
    });

    it('guest user register' , function() {
        const aviName = uniqueAviName();
        let register = service.register(aviName, "123456789",13)
        register.then ( _ => {assert.ok(1)})
        .catch( _ => assert.fail)
    })

    it('register with the same username' , function() {
        const aviName = uniqueAviName();
        service.register(aviName, "123456789",13);
        let register = service.register(aviName, "1234",13);
        register.then( _ => {assert.fail})
        .catch(_ => {assert.ok})
    })


});