import { assert, expect } from 'chai';
import { tPaymentInfo, tShippingInfo } from '../../src/DomainLayer/purchase/Purchase';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isOk } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service'
import { add_product, register_login, open_store } from './common';
import {setTestConfigurations} from '../../src/config';


const payInfo : tPaymentInfo = { holder: "Rick" , id:244, cardNumber:123, expMonth:5, expYear:2024, cvv:123, toAccount: 1, amount: 100};

const shippingInfo: tShippingInfo = {name:"Rick", address:"kineret", city:"jerusalem", country:"israel", zip:8727};


describe('4.11: view store buying history', function () {
    setTestConfigurations();        //changing external APIs to mocks
    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });
    it('viwe store history',async function () {
        let avi_sessionId = await service.enter();
        let avi =await register_login(service,avi_sessionId, "avi", "123456789");
        let store = await open_store(service,avi_sessionId, avi, "Mega", 123456, "Tel Aviv");
        
        console.log("----------------------------------------------------------------------------------");
        let banana = await add_product(service,avi_sessionId, avi, store, "banana", [], 1, 50);
        let apple = await add_product(service,avi_sessionId, avi, store, "apple", [], 1, 10);
        service.addProductTocart(avi_sessionId, store.getStoreId(), banana, 10);
        service.addProductTocart(avi_sessionId, store.getStoreId(), apple, 7);
        service.checkoutBasket(avi_sessionId, store.getStoreId(), shippingInfo);
        service.completeOrder(avi_sessionId, store.getStoreId(), payInfo, shippingInfo);
        service.getStorePurchaseHistory(avi_sessionId, store.getStoreId())
        .then(_ => assert.ok(""))
        .catch(_ => assert.fail())
    })
});