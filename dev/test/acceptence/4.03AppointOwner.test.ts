import {assert, expect} from 'chai';
import { Category } from '../../src/DomainLayer/store/Common';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import {Service} from '../../src/ServiceLayer/Service'

describe('4.3: Appoint Owner tests' , function() {

        it('avi opens store and appoints moshe to owner' , function() {
            Authentication.clean();
            let service : Service = Service.get_instance();
            service.clear();
            let guestId1 = service.enter();
            let guestId2 = service.enter();
            if (isOk(guestId1) && isOk(guestId2))
            {
                service.register("avi" , "123456");
                service.register("moshe" , "123456");
                let moshe = service.login(guestId1.value , "moshe" , "123456");
                let avi = service.login(guestId2.value , "avi" , "123456");
                if (isOk(avi) && isOk(moshe))
                {
                    let store = service.openStore(avi.value.getUserId() , "Mega" , 123456 , "Tel Aviv" );
                    if(isOk(store))
                    {
                        expect(isOk(service.appointStoreOwner(avi.value.getUserId() , store.value.getStoreId() , moshe.value.getUserId()))).to.equal(true);
                    }
                    else assert.fail();
                }
                else assert.fail();
            }
            else assert.fail(); 
        })

        it('moshe tries to appoint ali to owner without permissions' , function() {
            Authentication.clean();
            let service : Service = Service.get_instance();
            service.clear();
            let guestId1 = service.enter();
            let guestId2 = service.enter();
            let guestId3 = service.enter();
            if (isOk(guestId1) && isOk(guestId2) && isOk(guestId3))
            {
                service.register("avi" , "123456");
                service.register("moshe" , "123456");
                service.register("ali" , "123456");
                let moshe = service.login(guestId1.value , "moshe" , "123456");
                let avi = service.login(guestId2.value , "avi" , "123456");
                let ali = service.login(guestId3.value , "ali" , "123456");
                if (isOk(avi) && isOk(moshe) && isOk(ali))
                {
                    let store = service.openStore(avi.value.getUserId() , "Mega" , 123456 , "Tel Aviv" );
                    if(isOk(store))
                    {
                        service.appointStoreManager(avi.value.getUserId() , store.value.getStoreId() , moshe.value.getUserId());
                        expect(isOk(service.appointStoreOwner(moshe.value.getUserId() , store.value.getStoreId() , ali.value.getUserId()))).to.equal(false);
                    }
                    else assert.fail();
                }
                else assert.fail();
            }
            else assert.fail(); 
        })

    });