import { assert, expect } from 'chai';
import { servicesVersion } from 'typescript';
import Purchase, { tPaymentInfo, tShippingInfo } from '../../src/DomainLayer/purchase/Purchase';
import Transaction from '../../src/DomainLayer/purchase/Transaction';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { add_product, register_login, open_store } from './common';

const payInfo : tPaymentInfo = { holder: "shir" , id:2080, cardNumber:123, expMonth:5, expYear:2024, cvv:123, toAccount: 1, amount: 100};

const shippingInfo: tShippingInfo = {name:"shir", address:"rager", city:"beer sheva", country:"israel", zip:157};
import { PAYMENT_INFO, SHIPPING_INFO } from './common';
import { APIsWillSucceed, uniqueAviName, uniqueMegaName } from '../testUtil';
import {setReady, waitToRun} from '../testUtil';

describe('3.7: get subscriber history',function () {

    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });

    it('get personal purchase history',async function () {
        var service: Service =await Service.get_instance();
        let sessionId = await service.enter()
        let avi =await register_login(service,sessionId, uniqueAviName(), "1234");
        let store = await open_store(service,sessionId, avi, uniqueMegaName(), 123456, "Tel aviv");
        await store.addCategoryToRoot('Sweet')
        let banana = await add_product(service,sessionId, avi, store, "banana", ['Sweet'], 1, 50);
        let apple = await add_product(service,sessionId, avi, store, "apple", ['Sweet'], 1, 10);
        await service.addProductTocart(sessionId, store.getStoreId(), banana, 10);
        await service.addProductTocart(sessionId, store.getStoreId(), apple, 7);
        await service.checkoutBasket(sessionId, store.getStoreId(), SHIPPING_INFO);
        await service.completeOrder(sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO);
        let historyRes = await service.getMyPurchaseHistory(sessionId);
        let history = JSON.parse(historyRes);
        expect(history.length).to.equal(1);
    })
});