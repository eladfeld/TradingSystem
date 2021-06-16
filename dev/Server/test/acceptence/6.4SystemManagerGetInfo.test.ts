import { assert, expect } from 'chai';
import { tPaymentInfo, tShippingInfo } from '../../src/DomainLayer/purchase/Purchase';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isOk } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service';
import { add_product, enter_login, register_login, open_store } from './common';
import { APIsWillSucceed, uniqueAlufHasportName, uniqueAviName, uniqueName } from '../testUtil';
import { PAYMENT_INFO, SHIPPING_INFO } from './common';


const payInfo : tPaymentInfo = { holder: "Rick" , id:244, cardNumber:123, expMonth:5, expYear:2024, cvv:123, toAccount: 1, amount: 100};

const shippingInfo: tShippingInfo = {name:"Rick", address:"kineret", city:"jerusalem", country:"israel", zip:8727};

import {setReady, waitToRun} from '../testUtil';
describe('6.4: System Manager Get Info',function () {
    
    beforeEach( () => {
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        setReady(true);
    });
    it('system manager get store purchase history',async  function () {
        this.timeout(100000)
        var service: Service =await Service.get_instance();
        let avi_sessionId = await service.enter();
        let sys_manager_sessionId = await service.enter();
        let avi =await register_login(service,avi_sessionId, uniqueAviName(), "1234");
        let sys_manager =await service.login(sys_manager_sessionId, "michael", "1234");
        let store =await open_store(service,avi_sessionId, avi, uniqueAlufHasportName(), 123456, "Tel aviv");
        await store.addCategoryToRoot('Sweet')
        let apple = await add_product(service,avi_sessionId, avi, store, "apple", ['Sweet'], 10, 15);
        //await service.checkoutSingleProduct(sys_manager_sessionId, apple, 5, store.getStoreId(), SHIPPING_INFO);
        await service.addProductTocart(avi_sessionId,store.getStoreId(),apple,5)
        await service.checkoutBasket(avi_sessionId,store.getStoreId(),SHIPPING_INFO);
        await service.completeOrder(avi_sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO);
        await service.getStorePurchaseHistory(sys_manager_sessionId, store.getStoreId())
    })

    it('system manager get user purchase history', async function () {
        this.timeout(100000)
        var service: Service =await Service.get_instance();
        let avi_sessionId = await service.enter();
        let ali_sessionId = await service.enter();
        let sysm_sessionId = await service.enter();
        let avi = await register_login(service,avi_sessionId, uniqueAviName(), "1234");
        let ali = await register_login(service,ali_sessionId, uniqueName("ali"), "1234");
        let sys_manager = await service.login(sysm_sessionId, "michael", "1234");
        let store =await open_store(service,avi_sessionId, avi, uniqueAlufHasportName(), 123456, "Tel aviv");
        await store.addCategoryToRoot('Sweet')
        let apple = await add_product(service,avi_sessionId, avi, store, "apple", ['Sweet'], 10, 15);
        //await service.checkoutSingleProduct(ali_sessionId, apple, 5, store.getStoreId(), SHIPPING_INFO);
        await service.addProductTocart(ali_sessionId,store.getStoreId(),apple,5)
        await service.checkoutBasket(ali_sessionId,store.getStoreId(),SHIPPING_INFO);
        await service.completeOrder(ali_sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO);
        await service.getSubscriberPurchaseHistory(sysm_sessionId, ali.getUserId())
    })
});