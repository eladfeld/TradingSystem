import {expect} from 'chai';
import { Login } from '../../../src/DomainLayer/user/Login';
import { Register } from '../../../src/DomainLayer/user/Register';
import { isOk } from '../../../src/Result';
import { failIfRejected, failIfResolved, failTest } from '../../testUtil';



describe('login test' , function() {
    
    it('postive log in', async function(){
        try{
            await Register.register("yosi", "1234", 13);
            const subscriber = await Login.login("yosi", "1234");
            expect(subscriber).to.not.null;
        }catch(e){
            failTest("register or login failed");
        }
    })

    it('negative log in' , async function ()
    {
        failIfResolved(() => Login.login("yosi", "123"));
    });


});