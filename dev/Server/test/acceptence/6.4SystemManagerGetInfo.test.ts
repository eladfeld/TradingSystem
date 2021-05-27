import { assert, expect } from 'chai';
import { tPaymentInfo, tShippingInfo } from '../../src/DomainLayer/purchase/Purchase';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isOk } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service';
import { add_product, enter_login, register_login, open_store } from './common';

const payInfo : tPaymentInfo = { holder: "Rick" , id:244, cardNumber:123, expMonth:5, expYear:2024, cvv:123, toAccount: 1, amount: 100};

const shippingInfo: tShippingInfo = {name:"Rick", address:"kineret", city:"jerusalem", country:"israel", zip:8727};


describe('6.4: System Manager Get Info', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });
    it('system manager get store purchase history',async  function () {
        let avi_sessionId = await service.enter();
        let sys_manager_sessionId = await service.enter();
        let avi =await register_login(service,avi_sessionId, "avi", "1234");
        let sys_manager =await service.login(sys_manager_sessionId, "michael", "1234");
        let store =await open_store(service,avi_sessionId, avi, "Aluf hasport", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let apple = await add_product(service,avi_sessionId, avi, store, "apple", ['Sweet'], 10, 15);
        service.checkoutSingleProduct(sys_manager_sessionId, apple, 5, store.getStoreId(), shippingInfo);
        service.completeOrder(sys_manager_sessionId, store.getStoreId(), payInfo, shippingInfo);
        service.getStorePurchaseHistory(sys_manager_sessionId, store.getStoreId())
        .then(_ => assert.ok(""))
        .catch(_ => assert.fail())
    })

    it('system manager get user purchase history', async function () {
        let avi_sessionId = await service.enter();
        let ali_sessionId = await service.enter();
        let sysm_sessionId = await service.enter();
        let avi = await register_login(service,avi_sessionId, "avi", "1234");
        let ali = await register_login(service,ali_sessionId, "ali", "1234");
        let sys_manager = await service.login(sysm_sessionId, "michael", "1234");
        let store =await open_store(service,avi_sessionId, avi, "Aluf hasport", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let apple = await add_product(service,avi_sessionId, avi, store, "apple", ['Sweet'], 10, 15);
        service.checkoutSingleProduct(ali_sessionId, apple, 5, store.getStoreId(), shippingInfo);
        service.completeOrder(ali_sessionId, store.getStoreId(), payInfo, shippingInfo);
        service.getSubscriberPurchaseHistory(sysm_sessionId, ali.getUserId())
        .then(_ => assert.ok(""))
        .catch(_ => assert.fail())
    })
});