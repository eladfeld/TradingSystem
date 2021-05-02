import { expect , assert} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service';
import { enter_login, enter_register_login, open_store } from './common';

describe('2.5: store info test' , function() {

    var service : Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function() {
        service.clear();
    });

    it('store info test good', function () {
        let avi = enter_register_login(service, "avi", "123456789");
        let store1 = service.openStore(avi.getUserId(), "aluf hasport", 123456, "Tel Aviv");
        let store2 = service.openStore(avi.getUserId(), "mega", 123456, "Tel Aviv");
        if (isOk(store1) && isOk(store2)) {
            store1.value.addCategoryToRoot('Food')
            store2.value.addCategoryToRoot('Food')
            service.addNewProduct(avi.getUserId(), store1.value.getStoreId(), "Apple", ['Food'], 26, 10);
            service.addNewProduct(avi.getUserId(), store2.value.getStoreId(), "banana", ['Food'], 26, 20);
            expect(isOk(service.getStoreInfo(avi.getUserId(), store1.value.getStoreId()))).to.equal(true);
        }
        else assert.fail();
    })

    it('try to watch store without permission', function () {

        let avi: Subscriber = enter_register_login(service, "avi", "123456789");
        let store1: Result<Store> = service.openStore(avi.getUserId(), "aluf hasport", 123456, "Tel Aviv");
        let store2: Result<Store> = service.openStore(avi.getUserId(), "mega", 123456, "Tel Aviv");
        if (isOk(store1) && isOk(store2)) {
            store1.value.addCategoryToRoot('Food')
            store2.value.addCategoryToRoot('Food')
            service.addNewProduct(avi.getUserId(), store1.value.getStoreId(), "Apple", ['Food'], 26, 10);
            service.addNewProduct(avi.getUserId(), store2.value.getStoreId(), "banana", ['Food'], 26, 20);
            expect(isOk(service.getStoreInfo(avi.getUserId() + 1, store1.value.getStoreId()))).to.equal(false);
        }
        else assert.fail();
    })

    it('avi opens store , system manager watching it' , function() {
        //----------------avi opens store---------------------------------
        let avi = enter_register_login(service,"avi","123456789");
        var store1 = open_store(service,avi, "aluf hasport" , 123456 , "Tel Aviv");
        service.addNewProduct(avi.getUserId() , store1.getStoreId() , "Apple" , ['Food'] , 26 , 10);
        //---------------------------------------------------------------

        //-----------------system manager watches-------------------------
        let sys_manager = enter_login(service, "michael", "1234")
        expect(isOk(service.getStoreInfo(sys_manager.getUserId(), store1.getStoreId()))).to.equal(true);
        //---------------------------------------------------------------
    })


});