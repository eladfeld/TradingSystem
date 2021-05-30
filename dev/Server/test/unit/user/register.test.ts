import {expect} from 'chai';
import { Register } from '../../../src/DomainLayer/user/Register'
import { Authentication } from '../../../src/DomainLayer/user/Authentication';
import { isOk } from '../../../src/Result';
import { failIfRejected, failIfResolved } from '../../testUtil';

describe('register tests' , function() {
    
    
    it('good register', async function(){
        await failIfRejected(() => Register.register("avi","123456", 13));
    });

    it('register with used user name', async function(){
        await Register.register("avi","123456", 13);
        await failIfResolved(() => Register.register("avi","11123", 13))
    });

    
    
});