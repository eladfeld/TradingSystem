import {assert, expect} from 'chai';
import { Category } from '../../src/DomainLayer/store/Common';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import {Service} from '../../src/ServiceLayer/Service'

describe('4.7: remove appointment' , function() {

        it('remove recursive appointment' , function() {
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
                service.register("hezi" , "123456");

                let moshe = service.login(guestId1.value , "moshe" , "123456");
                let avi = service.login(guestId2.value , "avi" , "123456");
                let hezi = service.login(guestId3.value , "hezi" , "123456");
                if (isOk(avi) && isOk(moshe) && isOk(hezi))
                {
                    let store = service.openStore(avi.value.getUserId() , "Mega" , 123456 , "Tel Aviv" );
                    if(isOk(store))
                    {
                        service.appointStoreOwner(avi.value.getUserId() , store.value.getStoreId() , moshe.value.getUserId());
                        service.appointStoreManager(moshe.value.getUserId(), store.value.getStoreId(), hezi.value.getUserId());
                        service.deleteManagerFromStore(avi.value.getUserId(), moshe.value.getUserId(), store.value.getStoreId())
                        expect(store.value.getAppointments().length).to.equal(1);
                    }
                    else assert.fail();
                }
                else assert.fail();
            }
            else assert.fail(); 
    }) 

    it('try to remove manager without permission' , function() {
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
                    service.appointStoreManager(avi.value.getUserId() , store.value.getStoreId() , moshe.value.getUserId());
                    expect(isOk(service.deleteManagerFromStore(moshe.value.getUserId(), avi.value.getUserId(), store.value.getStoreId()))).to.equal(false);
                    
                }
                else assert.fail();
            }
            else assert.fail();
        }
        else assert.fail(); 
}) 





});