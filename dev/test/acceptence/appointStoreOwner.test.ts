import {expect} from 'chai';
import { Category } from '../../src/DomainLayer/store/Common';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import {Service} from '../../src/ServiceLayer/Service'

describe('appoint store manager (use case 4.3)' , function() {

    it('appoint store manager good' , function() {
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
                let storeRes: Result<Store> = service.openStore(subscriber.getUserId() , "Aluf Hasport" , 123456 , "Tel Aviv" );
                if(isOk(storeRes))
                {
                    service
                }
            }

        }
        
    }) 




});