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

    it('store info test good',async function () {
        let avi =await enter_register_login(service, "avi", "123456789");
        let store1 =await service.openStore(avi.getUserId(), "aluf hasport", 123456, "Tel Aviv");
        let store2 =await service.openStore(avi.getUserId(), "mega", 123456, "Tel Aviv");
        store1.addCategoryToRoot('Food')
        store2.addCategoryToRoot('Food')
        service.addNewProduct(avi.getUserId(), store1.getStoreId(), "Apple", ['Food'], 26, 10);
        service.addNewProduct(avi.getUserId(), store2.getStoreId(), "banana", ['Food'], 26, 20);
        service.getStoreInfo(avi.getUserId(), store1.getStoreId())
        .then( _ => assert.ok)
        .catch( _ => assert.fail)
    })

    it('try to watch store without permission',async function () {

        let avi: Subscriber =await enter_register_login(service, "avi", "123456789");
        let store1 =await service.openStore(avi.getUserId(), "aluf hasport", 123456, "Tel Aviv");
        let store2 =await service.openStore(avi.getUserId(), "mega", 123456, "Tel Aviv");
        store1.addCategoryToRoot('Food')
        store2.addCategoryToRoot('Food')
        service.addNewProduct(avi.getUserId(), store1.getStoreId(), "Apple", ['Food'], 26, 10);
        service.addNewProduct(avi.getUserId(), store2.getStoreId(), "banana", ['Food'], 26, 20);
        service.getStoreInfo(avi.getUserId() + 1, store1.getStoreId())
        .then( _ => assert.fail)
        .catch( _ => assert.ok)
    })

    it('avi opens store , system manager watching it' ,async function() {
        //----------------avi opens store---------------------------------
        let avi =await enter_register_login(service,"avi","123456789");
        var store1 =await open_store(service,avi, "aluf hasport" , 123456 , "Tel Aviv");
        service.addNewProduct(avi.getUserId() , store1.getStoreId() , "Apple" , ['Food'] , 26 , 10);
        //---------------------------------------------------------------

        //-----------------system manager watches-------------------------
        let sys_manager =await enter_login(service, "michael", "1234")
        service.getStoreInfo(sys_manager.getUserId(), store1.getStoreId())
        .then( _ => assert.ok)
        .catch( _ => assert.fail)
        //---------------------------------------------------------------
    })


});