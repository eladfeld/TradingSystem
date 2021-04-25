import { assert, expect } from 'chai';
import { servicesVersion } from 'typescript';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import Purchase from '../../src/DomainLayer/purchase/Purchase';
import { Category } from '../../src/DomainLayer/store/Common';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { enter_register_login, open_store } from './common';
import SupplySystem from '../../src/DomainLayer/apis/SupplySystem';
import PaymentSystem from '../../src/DomainLayer/apis/PaymentSystem';
import { ProductDB } from '../../src/DomainLayer/store/ProductDB';

describe('2.9: buy products', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
        Authentication.clean();
    });
    it('supply fail', function () {
        SupplySystem.willFail();
        PaymentSystem.willSucceed();
        let avi = enter_register_login(service, "avi", "1234");
        let store = open_store(service, avi, "Mega", 123456, "Tel aviv");
        let banana = service.addNewProduct(avi.getUserId(), store.getStoreId(), "banana", [Category.SWEET], 1, 50);
        let apple = service.addNewProduct(avi.getUserId(), store.getStoreId(), "apple", [Category.SWEET], 1, 10);
        if (isOk(banana) && isOk(apple)) {
            service.addProductTocart(avi.getUserId(), store.getStoreId(), banana.value, 10);
            service.addProductTocart(avi.getUserId(), store.getStoreId(), apple.value, 7);
            service.checkoutBasket(avi.getUserId(), store.getStoreId(), "king Goerge st 42");
            expect(isFailure(service.completeOrder(avi.getUserId(), store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address"))).to.equal(true);
        }
    })

    it('payment fail', function () {
        SupplySystem.willSucceed();
        PaymentSystem.willFail();
        let avi = enter_register_login(service, "avi", "1234");
        let store = open_store(service, avi, "Mega", 123456, "Tel aviv");
        let banana = service.addNewProduct(avi.getUserId(), store.getStoreId(), "banana", [Category.SWEET], 1, 50);
        let apple = service.addNewProduct(avi.getUserId(), store.getStoreId(), "apple", [Category.SWEET], 1, 10);
        if (isOk(banana) && isOk(apple)) {
            service.addProductTocart(avi.getUserId(), store.getStoreId(), banana.value, 10);
            service.addProductTocart(avi.getUserId(), store.getStoreId(), apple.value, 7);
            service.checkoutBasket(avi.getUserId(), store.getStoreId(), "king Goerge st 42");
            expect(isFailure(service.completeOrder(avi.getUserId(), store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address"))).to.equal(true);
        }
    })

    it('Api fails, cart unchanged', function () {
        SupplySystem.willSucceed();
        PaymentSystem.willFail();
        let avi = enter_register_login(service, "avi", "1234");
        let store = open_store(service, avi, "Mega", 123456, "Tel aviv");
        let banana = service.addNewProduct(avi.getUserId(), store.getStoreId(), "banana", [Category.SWEET], 1, 50);
        let apple = service.addNewProduct(avi.getUserId(), store.getStoreId(), "apple", [Category.SWEET], 1, 10);
        if (isOk(banana) && isOk(apple)) {
            service.addProductTocart(avi.getUserId(), store.getStoreId(), banana.value, 10);
            service.addProductTocart(avi.getUserId(), store.getStoreId(), apple.value, 7);
            service.checkoutBasket(avi.getUserId(), store.getStoreId(), "king Goerge st 42");
            expect(isFailure(service.completeOrder(avi.getUserId(), store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address"))).to.equal(true);
        }
        const res:Result<String> = service.getCartInfo(avi.getUserId());
        expect(isOk(res)).to.equal(true);
        const cartStr = isOk(res) ? res.value : "";
        let cart = JSON.parse( String(cartStr));
        expect(cart['baskets'][0]['products'].length).to.equal(2);
        expect(cart['baskets'][0]['products'].length).to.equal(2);//need to verify item quantities
        expect(cart['baskets'][0]['products'].length).to.equal(2);//need to verify item quantities
    })

    it('double checkout, inventory and basket editted once', function () {
        SupplySystem.willSucceed();
        PaymentSystem.willFail();
        let avi = enter_register_login(service, "avi", "1234");
        let store = open_store(service, avi, "Mega", 123456, "Tel aviv");
        let banana = service.addNewProduct(avi.getUserId(), store.getStoreId(), "banana", [Category.SWEET], 1, 50);
        let apple = service.addNewProduct(avi.getUserId(), store.getStoreId(), "apple", [Category.SWEET], 1, 20);
        if (isOk(banana) && isOk(apple)) {
            service.addProductTocart(avi.getUserId(), store.getStoreId(), banana.value, 10);
            service.addProductTocart(avi.getUserId(), store.getStoreId(), apple.value, 10);
            service.checkoutBasket(avi.getUserId(), store.getStoreId(), "king Goerge st 42");
            service.checkoutBasket(avi.getUserId(), store.getStoreId(), "king Goerge st 42");
        }
        const res:Result<String> = service.getCartInfo(avi.getUserId());
        expect(isOk(res)).to.equal(true);
        const cartStr = isOk(res) ? res.value : "";
        let cart = JSON.parse( String(cartStr));
        console.log(cart['baskets'][0]['products'][0]);
        expect(cart['baskets'][0]['products'].length).to.equal(2);
        expect(cart['baskets'][0]['products'][0]['quantity']).to.equal(10);
        expect(cart['baskets'][0]['products'][1]['quantity']).to.equal(10);
        expect(store.isProductAvailable(ProductDB.getProductByName('banana').getProductId(), 40)).to.equal(true);
        expect(store.isProductAvailable(ProductDB.getProductByName('banana').getProductId(), 41)).to.equal(false);
        expect(store.isProductAvailable(ProductDB.getProductByName('apple').getProductId(), 10)).to.equal(true);
        expect(store.isProductAvailable(ProductDB.getProductByName('apple').getProductId(), 11)).to.equal(false);
    })
});