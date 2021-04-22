import {assert, expect} from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';

describe('4.9: get store staff' , function() {

    it('get staff' , function() {
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
                    let staffRes: Result<string> = service.getStoreStaff(avi.value.getUserId(), store.value.getStoreId());
                    if(isOk(staffRes))
                    {
                        var staff = JSON.parse(staffRes.value);
                        expect(staff['subscribers'].length ).to.equal(2);
                    }
                    else assert.fail();
                }
                else assert.fail();
            }
            else assert.fail();
        }
        else assert.fail(); 
    })
}); 