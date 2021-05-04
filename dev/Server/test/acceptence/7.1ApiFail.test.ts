import { assert, expect } from 'chai';
import { servicesVersion } from 'typescript';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
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
    });
    it('supply fail', async function () {
        SupplySystem.willFail();
        PaymentSystem.willSucceed();
        let avi =await enter_register_login(service, "avi", "1234");
        let store =await open_store(service, avi, "Mega", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(avi.getUserId(), store.getStoreId(), "banana", ['Sweet'], 1, 50);
        let apple = await service.addNewProduct(avi.getUserId(), store.getStoreId(), "apple", ['Sweet'], 1, 10);
        service.addProductTocart(avi.getUserId(), store.getStoreId(), banana, 10);
        service.addProductTocart(avi.getUserId(), store.getStoreId(), apple, 7);
        service.checkoutBasket(avi.getUserId(), store.getStoreId(), "king Goerge st 42");
        service.completeOrder(avi.getUserId(), store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address")
        .then(_ => assert.ok)
        .catch(_ => assert.fail)
        }
    )

    it('payment fail', async function () {
        SupplySystem.willSucceed();
        PaymentSystem.willFail();
        let avi =await enter_register_login(service, "avi", "1234");
        let store =await open_store(service, avi, "Mega", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(avi.getUserId(), store.getStoreId(), "banana", ['Sweet'], 1, 50);
        let apple = await service.addNewProduct(avi.getUserId(), store.getStoreId(), "apple", ['Sweet'], 1, 10);
        service.addProductTocart(avi.getUserId(), store.getStoreId(), banana, 10);
        service.addProductTocart(avi.getUserId(), store.getStoreId(), apple, 7);
        service.checkoutBasket(avi.getUserId(), store.getStoreId(), "king Goerge st 42");
        service.completeOrder(avi.getUserId(), store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address")
        .then(_ => assert.fail)
        .catch(_ => assert.ok)
    })

    it('Api fails, cart unchanged',async function () {
        SupplySystem.willSucceed();
        PaymentSystem.willFail();
        let avi =await enter_register_login(service, "avi", "1234");
        let store =await open_store(service, avi, "Mega", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(avi.getUserId(), store.getStoreId(), "banana", ['Sweet'], 1, 50);
        let apple = await service.addNewProduct(avi.getUserId(), store.getStoreId(), "apple", ['Sweet'], 1, 10);
        service.addProductTocart(avi.getUserId(), store.getStoreId(), banana, 10);
        service.addProductTocart(avi.getUserId(), store.getStoreId(), apple, 7);
        service.checkoutBasket(avi.getUserId(), store.getStoreId(), "king Goerge st 42");
        service.completeOrder(avi.getUserId(), store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address")
        .then(_ => assert.fail)
        .catch(_ => assert.ok)

        service.getCartInfo(avi.getUserId())
        .then(cartStr => {
            let cart = JSON.parse( String(cartStr));
            expect(cart['baskets'][0]['products'].length).to.equal(2);
            expect(cart['baskets'][0]['products'].length).to.equal(2);//need to verify item quantities
            expect(cart['baskets'][0]['products'].length).to.equal(2);//need to verify item quantities
        })

    })

    it('double checkout, inventory and basket editted once',async function () {
        SupplySystem.willSucceed();
        PaymentSystem.willFail();
        let avi =await enter_register_login(service, "avi", "1234");
        let store =await open_store(service, avi, "Mega", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(avi.getUserId(), store.getStoreId(), "banana", ['Sweet'], 1, 50);
        let apple = await service.addNewProduct(avi.getUserId(), store.getStoreId(), "apple", ['Sweet'], 1, 20);
        service.addProductTocart(avi.getUserId(), store.getStoreId(), banana, 10);
        service.addProductTocart(avi.getUserId(), store.getStoreId(), apple, 10);
        service.checkoutBasket(avi.getUserId(), store.getStoreId(), "king Goerge st 42");
        service.checkoutBasket(avi.getUserId(), store.getStoreId(), "king Goerge st 42");
        
        service.getCartInfo(avi.getUserId())
        .then(cartStr => {
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
    })
});