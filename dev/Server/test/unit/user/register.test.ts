import {expect} from 'chai';
import { Register } from '../../../src/DomainLayer/user/Register'
import { Authentication } from '../../../src/DomainLayer/user/Authentication';
import { isOk } from '../../../src/Result';
import { APIsWillSucceed, failIfRejected, failIfResolved, uniqueAviName } from '../../testUtil';
import {setReady, waitToRun} from '../../testUtil';
import { DB, set_DB } from '../../../src/DataAccessLayer/DBfacade';
import { DBstub } from '../DBstub';

describe('register tests' , function() {
    let stubDB = new DBstub()
    

    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });
    
    it('good register', async function(){
        stubDB.getSubscriberByUsername = (username:string) => {return Promise.reject("")}
        set_DB(stubDB)
        await failIfRejected(() => Register.register(uniqueAviName(),"123456", 13));
    });

    it('register with used user name', async function(){
        stubDB.getSubscriberByUsername = (username:string) => {return Promise.reject(undefined)}
        set_DB(stubDB)
        const aviName = uniqueAviName();
        await Register.register(aviName,"123456", 13);
        stubDB.getSubscriberByUsername = (username:string) => {return Promise.resolve(undefined)}
        await failIfResolved(() => Register.register(aviName,"11123", 13))
    });

    
    
});