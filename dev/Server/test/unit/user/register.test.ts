import {expect} from 'chai';
import { Register } from '../../../src/DomainLayer/user/Register'
import { Authentication } from '../../../src/DomainLayer/user/Authentication';
import { isOk } from '../../../src/Result';

describe('register tests' , function() {
    
    
    it('good register', function(){
        expect(isOk(Register.register("avi","123456", 13))).to.equal(true);
    });

    it('register with used user name', function(){
        Register.register("avi","123456", 13);
        expect(isOk(Register.register("avi","11123", 13))).to.equal(false);
    });

    
    
});