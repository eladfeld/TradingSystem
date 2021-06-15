import {expect} from 'chai';
import { set_DB } from '../../../src/DataAccessLayer/DBfacade';
import { Login } from '../../../src/DomainLayer/user/Login';
import { Register } from '../../../src/DomainLayer/user/Register';
import { isOk } from '../../../src/Result';
import { APIsWillSucceed, failIfRejected, failIfResolved, failTest } from '../../testUtil';
import {setReady, waitToRun} from '../../testUtil';
import { DBstub } from '../DBstub';



describe('login test' , function() {
    beforeEach( () => {
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        setReady(true);
    });
    
    it('postive log in', async function(){
        try{
            await Register.register("yosi", "1234", 13);
            await Login.login("yosi", "1234");
        }catch(e){
            failTest(e);
        }
    })

    it('negative log in' , async function ()
    {
        failIfResolved(() => Login.login("yosi", "123"));
    });


});