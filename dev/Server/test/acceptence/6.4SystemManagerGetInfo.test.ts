import { assert, expect } from 'chai';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import { Category } from '../../src/DomainLayer/store/Common';
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
        Authentication.clean();
    });
    it('system manager get store purchase history', function () {
        let avi = enter_register_login(service, "avi", "1234");
        let sys_manager = enter_login(service, "michael", "1234");
        let store = open_store(service, avi, "Aluf hasport", 123456, "Tel aviv");
        let apple = add_product(service, avi, store, "apple", [Category.SWEET], 10, 15);
        service.checkoutSingleProduct(sys_manager.getUserId(), apple, 5, store.getStoreId(), "King Goerge street");
        service.completeOrder(sys_manager.getUserId(), store.getStoreId(), new PaymentInfo(1234, 456, 48948), "user address");
        expect(isOk(service.getStorePurchaseHistory(sys_manager.getUserId(), store.getStoreId())));

    })

    it('system manager get user purchase history', function () {
        let avi = enter_register_login(service, "avi", "1234");
        let ali = enter_register_login(service, "ali", "1234");
        let sys_manager = enter_login(service, "michael", "1234");
        let store = open_store(service, avi, "Aluf hasport", 123456, "Tel aviv");
        let apple = add_product(service, avi, store, "apple", [Category.SWEET], 10, 15);
        service.checkoutSingleProduct(ali.getUserId(), apple, 5, store.getStoreId(), "King Goerge street");
        service.completeOrder(ali.getUserId(), store.getStoreId(), new PaymentInfo(1234, 456, 48948), "user address");
        expect(isOk(service.getSubscriberPurchaseHistory(sys_manager.getUserId(), ali.getUserId()))).to.equal(true);
    })
});