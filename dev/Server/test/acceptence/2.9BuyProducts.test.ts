import { assert, expect, should } from 'chai';
import { collapseTextChangeRangesAcrossMultipleVersions, convertCompilerOptionsFromJson, servicesVersion } from 'typescript';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import Purchase from '../../src/DomainLayer/purchase/Purchase';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store } from './common';
import { doesNotMatch } from 'assert';

declare interface PromiseConstructor {
    allSettled(promises: Array<Promise<any>>): Promise<Array<{ status: 'fulfilled' | 'rejected', value?: any, reason?: any }>>;
}

describe('2.9: buy products', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });
    it('buy shopping basket', async function () {
        let sessionId = await service.enter()
        let avi = await register_login(service, sessionId, "avi", "1234");
        let store = await open_store(service, sessionId, avi, "Mega", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50);
        let apple = await service.addNewProduct(sessionId, store.getStoreId(), "apple", ['Sweet'], 1, 10);
        service.addProductTocart(sessionId, store.getStoreId(), banana, 10);
        service.addProductTocart(sessionId, store.getStoreId(), apple, 7);
        service.checkoutBasket(sessionId, store.getStoreId(), "king Goerge st 42");
        service.completeOrder(sessionId, store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address")
            .then(_ => assert.ok)
            .catch(_ => assert.fail)
    })


    it('try to buy too much items', async function () {
        let ali_sessionId = await service.enter()
        let avi_sessionId = await service.enter()
        let avi = await register_login(service, avi_sessionId, "avi", "1234");
        let ali = await register_login(service, ali_sessionId, "ali", "1234");
        let store = await open_store(service, avi_sessionId, avi, "Mega", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(avi_sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50);
        await service.addProductTocart(avi_sessionId, store.getStoreId(), banana, 40);
        await service.addProductTocart(ali_sessionId, store.getStoreId(), banana, 40);
        let a = service.checkoutBasket(avi_sessionId, store.getStoreId(), "king Goerge st 42");
        let b = await service.completeOrder(avi_sessionId, store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address");
        let checkout_res = service.checkoutBasket(ali_sessionId, store.getStoreId(), "king Goerge st 42")
        checkout_res.catch( _ => assert.fail).then( _ => assert.ok)
    })

    it('parallel buy of last item',function (done) {
        this.timeout(5000)
        //avi and ali enters the system
        service.enter().then(avi_sessionId => {
        service.enter().then(ali_sessionId => {
        
        //avi and ali registers anf logs in
        register_login(service, avi_sessionId, "avi", "1234").then(avi => {
        register_login(service, ali_sessionId, "ali", "1234").then(ali => {
        
        //avi opens a store and adds 1 banana to it
        open_store(service, avi_sessionId, avi, "Mega", 123456, "Tel aviv").then(store => {
        store.addCategoryToRoot('Sweet')
        service.addNewProduct(avi_sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 1).then(banana_id => {
        
        // both avi and ali add this banana their cart
        service.addProductTocart(avi_sessionId, store.getStoreId(), banana_id, 1).then(_ => {
        service.addProductTocart(ali_sessionId, store.getStoreId(), banana_id, 1).then(_ => {
        
        //both avi and ali try to checkout with this banana(async calls not blocking)
        service.checkoutBasket(ali_sessionId, store.getStoreId(), "king Goerge st 42").catch( _ => {})
        service.checkoutBasket(avi_sessionId, store.getStoreId(), "king Goerge st 42").catch( _ => {})
        
        //both avi and ali try to complete the order
        let ali_buy_res = service.completeOrder(ali_sessionId, store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address");
        let avi_buy_res = service.completeOrder(avi_sessionId, store.getStoreId(), new PaymentInfo(1234, 456, 2101569), "user address");

        // here avi succeeds and ali fails to buy
        avi_buy_res.then(avi_buy => {
            ali_buy_res.then(ali_buy => {
                //only one purchase should succeed
                assert.fail
                done("fail")
            })
            ali_buy_res.catch(msg => {
                // if here avi succeeded and ali failed
                expect(avi.quantityInBasket(store.getStoreId(), banana_id)).to.equal(0)
                expect(ali.quantityInBasket(store.getStoreId(), banana_id)).to.equal(1)
                expect(store.getProductQuantity(banana_id)).to.equal(0);
                expect(Purchase.getAllTransactions().length).to.equal(1);
                done()
            })
        })

        //here avi fails and ali succeeds to buy
        avi_buy_res.catch(msg => {
            // if here avi failed and ali succeeded
            ali_buy_res.then(_ => {
                expect(ali.quantityInBasket(store.getStoreId(), banana_id)).to.equal(0)
                expect(avi.quantityInBasket(store.getStoreId(), banana_id)).to.equal(1)
                expect(store.getProductQuantity(banana_id)).to.equal(0);
                expect( Purchase.getAllTransactions().length).to.equal(1);
                done()
            })
            ali_buy_res.catch(msg => {
                //only one purchase should fail
                assert.fail
                done("fail")
            })})})})
            })})})})})})
    })
});