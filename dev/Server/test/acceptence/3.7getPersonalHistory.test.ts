import { assert, expect } from 'chai';
import { servicesVersion } from 'typescript';
import Purchase, { tPaymentInfo, tShippingInfo } from '../../src/DomainLayer/purchase/Purchase';
import Transaction from '../../src/DomainLayer/purchase/Transaction';
import { Product } from '../../src/DomainLayer/store/Product';
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

describe('3.7: get subscriber history', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });

    it('get personal purchase history',async function () {
        let sessionId = await service.enter()
        let avi =await register_login(service,sessionId, "avi", "1234");
        let store = await open_store(service,sessionId, avi, "Mega", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let banana = await add_product(service,sessionId, avi, store, "banana", ['Sweet'], 1, 50);
        let apple = await add_product(service,sessionId, avi, store, "apple", ['Sweet'], 1, 10);
        service.addProductTocart(sessionId, store.getStoreId(), banana, 10);
        service.addProductTocart(sessionId, store.getStoreId(), apple, 7);
        service.checkoutBasket(sessionId, store.getStoreId(), shippingInfo);
        service.completeOrder(sessionId, store.getStoreId(), payInfo, shippingInfo);
        service.getSubscriberPurchaseHistory(sessionId, avi.getUserId())
        .then(historyRes =>{
            let history = JSON.parse(historyRes);
            expect(history.length).to.equal(1);
        }).catch( _ => assert.fail )
    })
});