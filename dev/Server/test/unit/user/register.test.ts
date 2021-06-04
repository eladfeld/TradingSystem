import {expect} from 'chai';
import { Register } from '../../../src/DomainLayer/user/Register'
import { Authentication } from '../../../src/DomainLayer/user/Authentication';
import { isOk } from '../../../src/Result';
import { APIsWillSucceed, failIfRejected, failIfResolved, uniqueAviName } from '../../testUtil';
import {setReady, waitToRun} from '../../testUtil';

describe('register tests' , function() {
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });
    
    
    it('good register', async function(){
        await failIfRejected(() => Register.register(uniqueAviName(),"123456", 13));
    });

    it('register with used user name', async function(){
        const aviName = uniqueAviName();
        await Register.register(aviName,"123456", 13);
        await failIfResolved(() => Register.register(aviName,"11123", 13))
    });

    
    
});