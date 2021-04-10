import {expect} from 'chai';
import {Login} from '../src/DomainLayer/Login'
import {Register} from '../src/DomainLayer/Register'


describe('login test' , function() {
    
    it('postive log in', function(){
        Register.register("yosi", "1234");
        expect(Login.login("yosi", "1234")).to.not.null;
    })

    it('negative log in' , function ()
    {
        expect(Login.login("yosi", "123")).to.null;
    });


});