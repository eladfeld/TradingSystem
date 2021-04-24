import { assert, expect } from 'chai';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import { Category } from '../../src/DomainLayer/store/Common';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isOk } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service'
import { add_product, enter_register_login, open_store } from './common';

describe('4.11: view store buying history', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
        Authentication.clean();
    });
    it('viwe store history', function () {
        let avi = enter_register_login(service, "avi", "123456789");
        let store = open_store(service, avi, "Mega", 123456, "Tel Aviv");
        let banana = add_product(service, avi, store, "banana", [Category.SWEET], 1, 50);
        let apple = add_product(service, avi, store, "apple", [Category.SWEET], 1, 10);

        service.addProductTocart(avi.getUserId(), store.getStoreId(), banana, 10);
        service.addProductTocart(avi.getUserId(), store.getStoreId(), apple, 7);
        service.checkoutBasket(avi.getUserId(), store.getStoreId(), "king Goerge st 42");
        service.completeOrder(avi.getUserId(), store.getStoreId(), new PaymentInfo(1234, 456, 2101569));
        expect(isOk(service.getStorePurchaseHistory(avi.getUserId(), store.getStoreId()))).to.equal(true);

    })
});