import {assert, expect} from 'chai';
import { Appointment } from '../../src/DomainLayer/user/Appointment';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';

describe('2.4: login system test' , function() {

    var service : Service = Service.get_instance();

    beforeEach(function () {
    });

    afterEach(function() {
        service.clear();
    });

    it('user login' ,async function() {
        let id =await service.enter();
        service.register("avi", "123456789",13);
        let subscriber = service.login(id,"avi","123456789");
        subscriber.then( value => {assert.ok("login subceeded")})
        .catch( reason => {assert.fail("failed test")})
    })

    it('user false password login' ,async function() {
        let id =await service.enter();
        service.register("avi", "123456789",13);
        let subscriber = service.login(id,"avi","1234")
        subscriber.catch( reason => {assert.ok("login failed")}).
        then( _=> {assert.fail("login should fail")})
    })

    it('user false username login' ,async function() {
        let id =await service.enter();
        service.register("avi", "123456789",13);
        let subscriber = service.login(id, "yogev ha'melech","123456789");
        subscriber.catch ( reason => {assert.ok("login failed (and should have)")})
        .then (_ => {assert.fail("login should fail")})
    });

});