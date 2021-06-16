import {expect} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isOk, Result } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed, uniqueAlufHasportName, uniqueAviName } from '../testUtil';
import { register_login, open_store } from './common';
import {setReady, waitToRun} from '../testUtil';

describe('2.8: Shopping Cart view and edit' ,function() {

    
    beforeEach( () => {
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        setReady(true);
    });

    it('shopping cart before and after delete' , async function()
    {
        this.timeout(10000)
        var service: Service =await Service.get_instance();
        const aviName = uniqueAviName();
        const storeName = uniqueAlufHasportName();

        let sessionId = await service.enter()
        let avi = await register_login(service,sessionId,aviName, "123456789");
        let store1 = await open_store(service,sessionId,avi,storeName , 123456 , "Tel Aviv" );
        await service.addCategoryToRoot(sessionId,store1.getStoreId(),'Sweet')
        await service.addCategoryToRoot(sessionId,store1.getStoreId(),'Computer')
        let prodId = await service.addNewProduct(sessionId,store1.getStoreId(),"banana",['Computer'],500,100,"");
        await service.addProductTocart(sessionId, store1.getStoreId() , prodId , 10);
        await service.getCartInfo(sessionId)
        await service.editCart(sessionId, store1.getStoreId(), prodId, 0 );
        let cart = await service.getCartInfo(sessionId);
        let tester: any = JSON.parse(cart);
        expect(tester['baskets'][0]['products'].length).to.equal(0);

    })
});