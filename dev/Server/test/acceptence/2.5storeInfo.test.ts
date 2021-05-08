import { expect , assert} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service';
import { enter_login, register_login, open_store } from './common';

describe('2.5: store info test' , function() {

    var service : Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function() {
        service.clear();
    });

    it('store info test good',async function () {
        let sessionId = await service.enter();
        let avi =await register_login(service,sessionId, "avi", "123456789");
        let store1 =await service.openStore(sessionId, "aluf hasport", 123456, "Tel Aviv");
        let store2 =await service.openStore(sessionId, "mega", 123456, "Tel Aviv");
        store1.addCategoryToRoot('Food')
        store2.addCategoryToRoot('Food')
        service.addNewProduct(sessionId, store1.getStoreId(), "Apple", ['Food'], 26, 10);
        service.addNewProduct(sessionId, store2.getStoreId(), "banana", ['Food'], 26, 20);
        service.getStoreInfo(sessionId, store1.getStoreId())
        .then( _ => assert.ok)
        .catch( _ => assert.fail)
    })

    it('try to watch store without permission',async function () {
        let sessionId = await service.enter();
        let avi: Subscriber =await register_login(service,sessionId, "avi", "123456789");
        let store1 =await service.openStore(sessionId, "aluf hasport", 123456, "Tel Aviv");
        let store2 =await service.openStore(sessionId, "mega", 123456, "Tel Aviv");
        store1.addCategoryToRoot('Food')
        store2.addCategoryToRoot('Food')
        service.addNewProduct(sessionId, store1.getStoreId(), "Apple", ['Food'], 26, 10);
        service.addNewProduct(sessionId, store2.getStoreId(), "banana", ['Food'], 26, 20);
        service.getStoreInfo(sessionId + 1, store1.getStoreId())
        .then( _ => assert.fail)
        .catch( _ => assert.ok)
    })

    it('avi opens store , system manager watching it' ,async function() {
        //----------------avi opens store---------------------------------
        let sessionId = await service.enter();
        let avi =await register_login(service,sessionId,"avi","123456789");
        var store1 =await open_store(service,sessionId,avi, "aluf hasport" , 123456 , "Tel Aviv");
        service.addNewProduct(sessionId , store1.getStoreId() , "Apple" , ['Food'] , 26 , 10);
        //---------------------------------------------------------------

        //-----------------system manager watches-------------------------
        let sys_manager =await enter_login(service, "michael", "1234")
        service.getStoreInfo(sessionId, store1.getStoreId())
        .then( _ => assert.ok)
        .catch( _ => assert.fail)
        //---------------------------------------------------------------
    })


});