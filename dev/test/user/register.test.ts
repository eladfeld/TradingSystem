import {expect} from 'chai';
import { Register } from '../../src/DomainLayer/user/Register'
import { SubscriberData } from '../../src/DomainLayer/user/Authentication';

describe('register tests' , function() {
    SubscriberData.clean();
    
    it('good register', function(){
        expect(Register.register("avi","123456")).to.equal(true);
    });

    it('register with used user name', function(){
        Register.register("avi","123456");
        expect(Register.register("avi","11123")).to.equal(false);
    });

    
    
});