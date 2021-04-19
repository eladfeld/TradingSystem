import {assert, expect} from 'chai';
import { Category } from '../../src/DomainLayer/store/Common';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import {Service} from '../../src/ServiceLayer/Service'

describe('4.6: edit store permission' , function() {

        it('avi opens store and appoints manager with all the permissions' , function() {
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
                        expect(isOk(service.getStoreStaff(moshe.value.getUserId(), store.value.getStoreId()))).to.equal(false);
                        service.editStaffPermission(avi.value.getUserId(), moshe.value.getUserId(), store.value.getStoreId(), -1);
                        expect(isOk(service.getStoreStaff(moshe.value.getUserId(), store.value.getStoreId()))).to.equal(true);


                    }
                    else assert.fail();
                }
                else assert.fail();
            }
            else assert.fail(); 
        })

        it('moshe, a store manager tries to edit store inventory without permissions' , function() {
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
                        expect(isOk(service.addNewProduct(moshe.value.getUserId(),store.value.getStoreId(),"banana" , [Category.SWEET] , 15))).to.equal(false);
                    }
                    else assert.fail();
                }
                else assert.fail();
            }
            else assert.fail(); 
        })
});