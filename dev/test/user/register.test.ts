import {expect} from 'chai';
import { Register } from '../../src/DomainLayer/user/Register'
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isOk } from '../../src/Result';

describe('register tests' , function() {
    
    
    it('good register', function(){
        Authentication.clean();
        expect(isOk(Register.register("avi","123456"))).to.equal(true);
    });

    it('register with used user name', function(){
        Authentication.clean();
        Register.register("avi","123456");
        expect(isOk(Register.register("avi","11123"))).to.equal(false);
    });

    
    
});