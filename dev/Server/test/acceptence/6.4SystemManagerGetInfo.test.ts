import { assert, expect } from 'chai';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isOk } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service';
import { add_product, enter_login, enter_register_login, open_store } from './common';

describe('6.4: System Manager Get Info', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });
    it('system manager get store purchase history',async  function () {
        let avi =await enter_register_login(service, "avi", "1234");
        let sys_manager =await enter_login(service, "michael", "1234");
        let store =await open_store(service, avi, "Aluf hasport", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let apple = await add_product(service, avi, store, "apple", ['Sweet'], 10, 15);
        service.checkoutSingleProduct(sys_manager.getUserId(), apple, 5, store.getStoreId(), "King Goerge street");
        service.completeOrder(sys_manager.getUserId(), store.getStoreId(), new PaymentInfo(1234, 456, 48948), "user address");
        service.getStorePurchaseHistory(sys_manager.getUserId(), store.getStoreId())
        .then(_ => assert.ok)
        .catch(_ => assert.fail)
    })

    it('system manager get user purchase history', async function () {
        let avi = await enter_register_login(service, "avi", "1234");
        let ali = await enter_register_login(service, "ali", "1234");
        let sys_manager = await enter_login(service, "michael", "1234");
        let store =await open_store(service, avi, "Aluf hasport", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let apple = await add_product(service, avi, store, "apple", ['Sweet'], 10, 15);
        service.checkoutSingleProduct(ali.getUserId(), apple, 5, store.getStoreId(), "King Goerge street");
        service.completeOrder(ali.getUserId(), store.getStoreId(), new PaymentInfo(1234, 456, 48948), "user address");
        service.getSubscriberPurchaseHistory(sys_manager.getUserId(), ali.getUserId())
        .then(_ => assert.ok)
        .catch(_ => assert.fail)
    })
});