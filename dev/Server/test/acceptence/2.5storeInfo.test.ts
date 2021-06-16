import { expect , assert} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed, uniqueAlufHasportName, uniqueAviName} from '../testUtil';
import { enter_login, register_login, open_store } from './common';
import {uniqueName, isReady,  check} from '../testUtil';
import {setReady, waitToRun} from '../testUtil';
import { truncate_tables } from '../../src/DataAccessLayer/connectDb';

describe('2.5: store info test' , function() {
        
    beforeEach( () => {
        
        return waitToRun(()=>APIsWillSucceed());
    });

    afterEach(async function () {
        setReady(true);
    });

    it('store info test good',async function () {
        this.timeout(100000)
        var service : Service =await Service.get_instance();
        const aviName = uniqueAviName();
        const storeName_1 = uniqueAlufHasportName();
        const storeName_2 = uniqueAlufHasportName();
        let sessionId = await service.enter();
        let avi =await register_login(service,sessionId, aviName, "123456789");
        let store1 =await service.openStore(sessionId, storeName_1, 123456, "Tel Aviv");
        let store2 =await service.openStore(sessionId, storeName_2, 123456, "Tel Aviv");
        await service.addCategoryToRoot(sessionId,store1.getStoreId(),'Food')
        await service.addCategoryToRoot(sessionId,store2.getStoreId(),'Food')
        await service.addNewProduct(sessionId, store1.getStoreId(), "Apple", ['Food'], 26, 10,"");
        await service.addNewProduct(sessionId, store2.getStoreId(), "banana", ['Food'], 26, 20,"");
        await service.getStoreInfo(sessionId, store1.getStoreId())
        // .then( _ => assert.ok(1))
        // .catch( _ => assert.fail(""))
    })

    it('try to watch store without permission',async function () {
        this.timeout(100000)
        var service : Service =await Service.get_instance();
        const aviName = uniqueAviName();
        const storeName_1 = uniqueAlufHasportName();
        const storeName_2 = uniqueAlufHasportName();

        let sessionId = await service.enter();
        let avi: Subscriber =await register_login(service,sessionId, aviName, "123456789");
        let store1 =await service.openStore(sessionId, storeName_1, 123456, "Tel Aviv");
        let store2 =await service.openStore(sessionId, storeName_2, 123456, "Tel Aviv");
        await store1.addCategoryToRoot('Food')
        await store2.addCategoryToRoot('Food')
        await service.addNewProduct(sessionId, store1.getStoreId(), "Apple", ['Food'], 26, 10,"");
        await service.addNewProduct(sessionId, store2.getStoreId(), "banana", ['Food'], 26, 20,"");
        service.getStoreInfo(sessionId + 1, store1.getStoreId())
        .then( _ => assert.fail())
        .catch( _ => assert.ok(1))
    })

    it('avi opens store , system manager watching it' ,async function() {
        this.timeout(100000)
        var service : Service =await Service.get_instance();
        const aviName = uniqueAviName();
        const storeName = uniqueAlufHasportName();
        const michaelName = "michael";

        //----------------avi opens store---------------------------------
        let aviSessionId = await service.enter();
        let avi =await register_login(service,aviSessionId,aviName,"123456789");
        var store1 =await open_store(service,aviSessionId,avi, storeName , 123456 , "Tel Aviv");
        //---------------------------------------------------------------

        //-----------------system manager watches-------------------------

        let sm_sessionId = await service.enter()
        let sys_manager =await service.login(sm_sessionId, michaelName, "1234")
        try {
            let info = await service.getStoreInfo(sm_sessionId, store1.getStoreId())
        }
        catch(e) {
            console.log(e)
            assert.fail()
        }
        assert.ok(1)
        //---------------------------------------------------------------
    })


});