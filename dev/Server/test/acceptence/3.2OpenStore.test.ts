import {expect} from 'chai';
import { Category } from '../../src/DomainLayer/store/Common';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';

describe('3.2: open store test' , function() {

    it('open store good' , function() {
        Authentication.clean();
        let service: Service = Service.get_instance();
        service.clear();
        let enter_res = service.enter();
        if (isOk(enter_res))
        {
            service.register("avi", "123456789");
            let login_res: Result<Subscriber> = service.login(enter_res.value, "avi", "123456789");
            if(isOk(login_res))
            {
                let subscriber : Subscriber = login_res.value;
                expect(isOk(service.openStore(subscriber.getUserId() , "Aluf Hasport" , 123456 , "Tel Aviv" ))).to.equal(true);
            }

        }
        
    }) 

    it('open store with non exist subscriber' , function() {
        Authentication.clean();
        let service: Service = Service.get_instance();
        service.clear();
        let enter_res = service.enter();
        if (isOk(enter_res))
        {
            service.register("avi", "123456789");
            let login_res: Result<Subscriber> = service.login(enter_res.value, "avi", "123456789");
            if(isOk(login_res))
            {
                let subscriber : Subscriber = login_res.value;
                expect(isOk(service.openStore(subscriber.getUserId() + 1 , "Aluf Hasport" , 123456 , "Tel Aviv" ))).to.equal(false);
            }

        }
        
    }) 




});