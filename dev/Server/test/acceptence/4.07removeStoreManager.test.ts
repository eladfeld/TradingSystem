import { assert, expect } from 'chai';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isFailure, isOk, Result } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed, failIfResolved, uniqueAviName, uniqueMegaName, uniqueMosheName, uniqueName } from '../testUtil';
import { register_login, open_store } from './common';
import {setReady, waitToRun} from '../testUtil';

describe('4.7: remove appointment',async function () {

    var service: Service =await Service.get_instance();
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });
    it('remove recursive appointment',async function () {
        let avi_sessionId = await service.enter();
        let moshe_sessionId = await service.enter();
        let hezi_sessionId = await service.enter();

        let avi =await register_login(service,avi_sessionId, uniqueAviName(), "123456789");
        let moshe =await register_login(service,moshe_sessionId, uniqueMosheName(), "123456789");
        let hezi =await register_login(service,hezi_sessionId, uniqueName("hezi"), "123456789");
        let store =await open_store(service,avi_sessionId, avi, uniqueMegaName(), 123456, "Tel Aviv");


        await service.appointStoreOwner(avi_sessionId, store.getStoreId(), moshe.getUsername());
        await service.appointStoreManager(moshe_sessionId, store.getStoreId(), hezi.getUsername());
        await service.deleteManagerFromStore(avi_sessionId, moshe.getUsername(), store.getStoreId())
        expect(store.getAppointments().length).to.equal(1);
    })

    it('try to remove manager without permission',async function () {
        let avi_sessionId = await service.enter();
        let moshe_sessionId = await service.enter();
        let avi =await register_login(service,avi_sessionId, uniqueAviName(), "123456789");
        let moshe =await register_login(service,moshe_sessionId, uniqueMosheName(), "123456789");
        let store =await open_store(service,avi_sessionId, avi, uniqueMegaName(), 123456, "Tel Aviv");
        await service.appointStoreManager(avi_sessionId, store.getStoreId(), moshe.getUsername());
        await failIfResolved(()=> service.deleteManagerFromStore(moshe_sessionId, avi.getUsername(), store.getStoreId()))
    })

});