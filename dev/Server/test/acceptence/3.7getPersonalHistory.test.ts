import { assert, expect } from 'chai';
import { servicesVersion } from 'typescript';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import Purchase from '../../src/DomainLayer/purchase/Purchase';
import Transaction from '../../src/DomainLayer/purchase/Transaction';
import { Category } from '../../src/DomainLayer/store/Common';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { add_product, enter_register_login, open_store } from './common';

describe('3.7: get subscriber history', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
        Authentication.clean();
    });

    it('get personal purchase history', function () {

        let avi = enter_register_login(service, "avi", "1234");
        let store = open_store(service, avi, "Mega", 123456, "Tel aviv");
        let banana = add_product(service, avi, store, "banana", [Category.SWEET], 1, 50);
        let apple = add_product(service, avi, store, "apple", [Category.SWEET], 1, 10);
        service.addProductTocart(avi.getUserId(), store.getStoreId(), banana, 10);
        service.addProductTocart(avi.getUserId(), store.getStoreId(), apple, 7);
        service.checkoutBasket(avi.getUserId(), store.getStoreId(), "king Goerge st 42");
        service.completeOrder(avi.getUserId(), store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address");
        let historyRes: Result<any> = service.getSubscriberPurchaseHistory(avi.getUserId(), avi.getUserId());
        if (isOk(historyRes)) {
            let history = JSON.parse(historyRes.value);
            expect(history.length).to.equal(1);
        }
        else assert.fail();
    })
});