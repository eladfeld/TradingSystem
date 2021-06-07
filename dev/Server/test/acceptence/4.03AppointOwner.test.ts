import { assert, expect } from 'chai';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store } from './common';
import { APIsWillSucceed, failIfResolved, uniqueAviName, uniqueMegaName, uniqueMosheName, uniqueName } from '../testUtil';
import {setReady, waitToRun} from '../testUtil';

describe('4.3: Appoint Owner tests', function () {

    var service: Service = Service.get_instance();
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });
    it('avi opens store and appoints moshe to owner',async function () {
        let avi_sessionId = await service.enter();
        let moshe_sessionId = await service.enter();
        let avi =await register_login(service,avi_sessionId, uniqueAviName(), "123456789")
        let moshe =await register_login(service,moshe_sessionId, uniqueMosheName(), "123456789")
        let store = await open_store(service,avi_sessionId, avi, uniqueMegaName(), 123456, "Tel Aviv");
        await service.appointStoreOwner(avi_sessionId, store.getStoreId(), moshe.getUsername())
    })

    it('moshe tries to appoint ali to owner without permissions',async function () {
        let avi_sessionId = await service.enter();
        let moshe_sessionId = await service.enter();
        let ali_sessionId = await service.enter();
        let avi =await register_login(service,avi_sessionId, uniqueAviName(), "123456789")
        let moshe =await register_login(service,moshe_sessionId, uniqueMosheName(), "123456789")
        let ali =await register_login(service,ali_sessionId, uniqueName("ali"), "123456789")
        let store = await open_store(service,avi_sessionId, avi, uniqueMegaName(), 123456, "Tel Aviv");
        await service.appointStoreManager(avi_sessionId, store.getStoreId(), moshe.getUsername());
        await failIfResolved(()=> service.appointStoreOwner(moshe_sessionId, store.getStoreId(), ali.getUsername()));
    })


    it('parallel appoint owner test',async function () {
        // avi and moshe and ali enter the system and login
        let avi_sessionId = await service.enter();
        let moshe_sessionId = await service.enter();
        let ali_sessionId = await service.enter();
        let avi =await register_login(service,avi_sessionId, uniqueAviName(), "123456789")
        let moshe =await register_login(service,moshe_sessionId, uniqueMosheName(), "123456789")
        let ali =await register_login(service,ali_sessionId, uniqueName("ali"), "123456789")

        // avi opens a store and appoints ali as owner
        let store = await open_store(service,avi_sessionId, avi, uniqueMegaName(), 123456, "Tel Aviv");
        await service.appointStoreOwner(avi_sessionId, store.getStoreId(), ali.getUsername());

        //now both avi and ali try to appoint moshe as owner
        let avi_appointing = await service.appointStoreOwner(avi_sessionId, store.getStoreId(), moshe.getUsername())
        let ali_appointing = await failIfResolved(()=> service.appointStoreOwner(ali_sessionId, store.getStoreId(), moshe.getUsername()))

    //     // here avi succeeds and ali fails
    //     avi_appointing.then( _ => {
    //         ali_appointing.then( _ => {
    //             // if both succeed its failure
    //             assert.fail
    //         })
    //         ali_appointing.catch( _ =>{
    //             expect(moshe.getAppointments()[0].appointer.getUserId()).to.equal(avi.getUserId())
    //             assert.ok("")
    //         })
    //     })

    //     // here ali succeeds and avi fails
    //     avi_appointing.catch( _ => {
    //         ali_appointing.catch( _ => {
    //             // if both succeed its failure
    //             assert.fail
    //         })
    //         ali_appointing.then(_ => {
    //             expect(moshe.getAppointments()[0].appointer.getUserId()).to.equal(ali.getUserId())
    //             assert.ok("")
    //         })
    //     })
    })

});

