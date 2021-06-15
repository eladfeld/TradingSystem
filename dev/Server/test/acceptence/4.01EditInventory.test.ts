import { assert, expect } from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { add_product, register_login, open_store } from './common';
import { APIsWillSucceed, failIfResolved, uniqueAlufHasportName, uniqueAviName, uniqueMegaName } from '../testUtil';
import {setReady, waitToRun} from '../testUtil';

describe('4.1: edit store inventory',function () {
    beforeEach( () => {
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        setReady(true);
    });

    it('edit non existent product ',async function () {
        var service: Service =await Service.get_instance();
        let sessionId = await service.enter();
        let avi =await register_login(service,sessionId, uniqueAviName(), "123456789")
        let store = await open_store(service,sessionId, avi, uniqueMegaName(), 123456, "Tel Aviv");
        await store.addCategoryToRoot('Sweet')
        failIfResolved(()=> service.editStoreInventory(sessionId, store.getStoreId(), 10, 10))
    })

    it('edit existing product', async function () {
        var service: Service =await Service.get_instance();
        let sessionId = await service.enter();
        let avi = await register_login(service,sessionId, uniqueAviName(), "123456789")
        let store = await open_store(service,sessionId, avi, uniqueMegaName(), 123456, "Tel Aviv");
        await store.addCategoryToRoot('Sweet')
        let banana = await add_product(service,sessionId, avi, store, "banana", ['Sweet'], 12, 100);
        await service.editStoreInventory(sessionId, store.getStoreId(), banana, 10)
    })

});