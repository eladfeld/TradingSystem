import {assert, expect} from 'chai';
import { Category } from '../../src/DomainLayer/store/Common';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';

describe('3.1: Logout' , function() {

    it('good logout' , function(){
        Authentication.clean();
        let service : Service = Service.get_instance();
        service.clear();
        let enter_res = service.enter();
        if (isOk(enter_res))
        {
            let login_res = service.login(enter_res.value , "michael" , "1234");
            if (isOk(login_res))
            {
                expect(service.get_logged_system_managers().length).to.equal(1);
                service.logout(login_res.value.getUserId())
                expect(service.get_logged_system_managers().length).to.equal(0);
            }
            else assert.fail();
        }
        else assert.fail();
    });

    it('system manager tries to open store store after logout' , function(){
        Authentication.clean()
        let service : Service = Service.get_instance();
        service.clear()
        let enter_res = service.enter();
        if (isOk(enter_res))
        {
            let login_res = service.login(enter_res.value , "michael" , "1234");
            
            if (isOk(login_res))
            {

                service.logout(login_res.value.getUserId());
                expect(isOk(service.openStore(login_res.value.getUserId() , "aluf Hasport" , 123456 , "Tel Aviv"))).to.equal(false); 
            }
            else assert.fail();
        }
        else assert.fail();
    });
});