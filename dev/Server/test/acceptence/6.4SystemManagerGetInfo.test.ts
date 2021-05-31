import { assert, expect } from 'chai';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isOk } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed, uniqueAlufHasportName, uniqueAviName, uniqueName } from '../testUtil';
import { add_product, enter_login, register_login, open_store, PAYMENT_INFO, SHIPPING_INFO } from './common';

describe('6.4: System Manager Get Info', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
        APIsWillSucceed();
    });

    afterEach(function () {
        //service.clear();
    });
    it('system manager get store purchase history',async  function () {
        let avi_sessionId = await service.enter();
        let sys_manager_sessionId = await service.enter();
        let avi =await register_login(service,avi_sessionId, uniqueAviName(), "1234");
        let sys_manager =await service.login(sys_manager_sessionId, "michael", "1234");
        let store =await open_store(service,avi_sessionId, avi, uniqueAlufHasportName(), 123456, "Tel aviv");
        await store.addCategoryToRoot('Sweet')
        let apple = await add_product(service,avi_sessionId, avi, store, "apple", ['Sweet'], 10, 15);
        await service.checkoutSingleProduct(sys_manager_sessionId, apple, 5, store.getStoreId(), "King Goerge street");
        await service.completeOrder(sys_manager_sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO);
        await service.getStorePurchaseHistory(sys_manager_sessionId, store.getStoreId())
    })

    it('system manager get user purchase history', async function () {
        let avi_sessionId = await service.enter();
        let ali_sessionId = await service.enter();
        let sysm_sessionId = await service.enter();
        let avi = await register_login(service,avi_sessionId, uniqueAviName(), "1234");
        let ali = await register_login(service,ali_sessionId, uniqueName("ali"), "1234");
        let sys_manager = await service.login(sysm_sessionId, "michael", "1234");
        let store =await open_store(service,avi_sessionId, avi, uniqueAlufHasportName(), 123456, "Tel aviv");
        await store.addCategoryToRoot('Sweet')
        let apple = await add_product(service,avi_sessionId, avi, store, "apple", ['Sweet'], 10, 15);
        await service.checkoutSingleProduct(ali_sessionId, apple, 5, store.getStoreId(), "King Goerge street");
        await service.completeOrder(ali_sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO);
        await service.getSubscriberPurchaseHistory(sysm_sessionId, ali.getUserId())
    })
});