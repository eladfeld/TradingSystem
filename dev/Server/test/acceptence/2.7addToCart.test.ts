import {expect} from 'chai';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store } from './common';
import { APIsWillSucceed, failIfResolved, uniqueAlufHasportName, uniqueAviName } from '../testUtil';
import { fail } from 'assert';
import {setReady, waitToRun} from '../testUtil';

describe('2.7: add to cart test' , function() {

    var service: Service = Service.get_instance();
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });

    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });
    it('add to cart good' , async function() {
        const aviName = uniqueAviName();
        const storeName = uniqueAlufHasportName();
        let sessionId = await service.enter();
        let avi = await register_login(service,sessionId,aviName,"123456789");
        let store1 =await open_store(service,sessionId,avi , storeName , 123456 , "Tel Aviv" );
        await service.addCategoryToRoot(sessionId, store1.getStoreId(),'Sweet')
        await service.addCategoryToRoot(sessionId, store1.getStoreId(),'Computer')
        let product1: Product = new Product("banana", ['Sweet']);
        let prodId = await service.addNewProduct(sessionId, store1.getStoreId(), product1.getName(),['Computer'],500,100);
        await service.addProductTocart(sessionId, store1.getStoreId() , prodId , 10)
    })

    it('add non existent product to cart' , async function() {
        const aviName = uniqueAviName();
        const storeName = uniqueAlufHasportName();

        let sessionId = await service.enter()
        let avi = await register_login(service,sessionId,aviName,"123456789");
        let store1 =await open_store(service,sessionId,avi , storeName , 123456 , "Tel Aviv" );
        await failIfResolved(()=> service.addProductTocart(sessionId, store1.getStoreId() , 1 , 10))
        // .then( _ => expect(true).to.eq(false))
        // .catch( _ => expect(true).to.eq(true))
    })


});