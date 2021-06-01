import { assert, expect } from 'chai';
import { servicesVersion } from 'typescript';
import Purchase from '../../src/DomainLayer/purchase/Purchase';
import Transaction from '../../src/DomainLayer/purchase/Transaction';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store } from './common';
import { APIsWillSucceed, failIfRejected, uniqueAviName, uniqueMegaName } from '../testUtil';
import {setReady, waitToRun} from '../testUtil';

describe('2.6: find product', function () {


    var service: Service = Service.get_instance();
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });
    it('find product by name', async function () {
        const aviName = uniqueAviName();
        const megaName = uniqueMegaName();
        let sessionId = await service.enter();
        let avi = await register_login(service,sessionId,aviName,"123456");
        let store =await open_store(service,sessionId,avi,megaName,123456,"Tel Aviv");
        await store.addCategoryToRoot('Food')
        let banana = service.addNewProduct(sessionId, store.getStoreId(), "banana", ['Food'], 156, 50);
        let apple = service.addNewProduct(sessionId, store.getStoreId(), "apple", ['Food'], 1, 10);
        let products = await service.getPruductInfoByName(sessionId, "banana")
        //console.log('[t] res:',JSON.parse(products));
        expect(JSON.parse(products)['products'].length).to.greaterThanOrEqual(1)
        // .then(products => expect(JSON.parse(products)['products'].length).to.equal(1))
        // .catch(assert.fail)
    })

    it('find product by category', async function () {
        const aviName = uniqueAviName();
        const megaName = uniqueMegaName();
        let sessionId = await failIfRejected(()=> service.enter());
        let avi = await failIfRejected(()=> register_login(service,sessionId, aviName, "1234"));
        let store =await failIfRejected(()=> open_store(service,sessionId,avi,megaName,123465,"Tel Aviv"));
        await store.addCategoryToRoot('Sweet')
        await store.addCategoryToRoot('Sport')
        await store.addCategoryToRoot('Electric')
        let banana = await service.addNewProduct(sessionId, store.getStoreId(), "banana", ['Sweet'], 156, 50);
        let apple = await service.addNewProduct(sessionId, store.getStoreId(), "apple", ['Sweet'], 1, 10);
        let ball = await service.addNewProduct(sessionId, store.getStoreId(), "ball", ['Sport'], 3, 44);
        let pc = await service.addNewProduct(sessionId, store.getStoreId(), "pc", ['Electric'], 2442, 123);
        let products = await service.getPruductInfoByCategory(sessionId, 'Sweet');
        expect(JSON.parse(products)['products'].length).to.equal(2)
        // .then(products => expect(JSON.parse(products)['products'].length).to.equal(2))
        // .catch(assert.fail)
    })
});