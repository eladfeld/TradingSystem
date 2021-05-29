import { assert, expect } from 'chai';
import Purchase, { tPaymentInfo, tShippingInfo } from '../../src/DomainLayer/purchase/Purchase';
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store } from './common';
import {setTestConfigurations} from '../../src/config';


declare interface PromiseConstructor {
    allSettled(promises: Array<Promise<any>>): Promise<Array<{ status: 'fulfilled' | 'rejected', value?: any, reason?: any }>>;
}

const payInfo : tPaymentInfo = { holder: "Rick" , id:244, cardNumber:123, expMonth:5, expYear:2024, cvv:123, toAccount: 1, amount: 100};

const shippingInfo: tShippingInfo = {name:"Rick", address:"kineret", city:"jerusalem", country:"israel", zip:8727};
setTestConfigurations;

describe('2.9: buy products', function () {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });
    it('buy shopping basket', async function () {
        let avi_sessionId = await service.enter()
        let avi = await register_login(service, avi_sessionId, "avi", "1234");
        let store = await open_store(service, avi_sessionId, avi, "Mega", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(avi_sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50);
        let apple = await service.addNewProduct(avi_sessionId, store.getStoreId(), "apple", ['Sweet'], 1, 10);
        await service.addProductTocart(avi_sessionId, store.getStoreId(), banana, 10);
        await service.addProductTocart(avi_sessionId, store.getStoreId(), apple, 7);
        await service.checkoutBasket(avi_sessionId, store.getStoreId(), shippingInfo);
        let purchase_res = await service.completeOrder(avi_sessionId, store.getStoreId(), payInfo, shippingInfo)

        expect(purchase_res).to.equal(true)
        // check basktet updated successfully
        expect(avi.quantityInBasket(store.getStoreId(),banana)).to.equal(0)
        expect(avi.quantityInBasket(store.getStoreId(),apple)).to.equal(0)

        // check store inventory updated successfully
        expect(store.getProductQuantity(banana)).to.equal(40)
        expect(store.getProductQuantity(apple)).to.equal(3)
        
        // if transaction completed then the external systems were activated 
        expect(Purchase.getAllTransactions().length).to.equal(1)
    })


    it('try to buy too much items', async function () {
        // avi and ali enter the system register and login
        let ali_sessionId = await service.enter()
        let avi_sessionId = await service.enter()
        let avi = await register_login(service, avi_sessionId, "avi", "1234");
        let ali = await register_login(service, ali_sessionId, "ali", "1234");

        // avi opens store and adds 50 bananas to it
        let store = await open_store(service, avi_sessionId, avi, "Mega", 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(avi_sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50);

        // avi and ali both add 40 bananas to their basket
        await service.addProductTocart(avi_sessionId, store.getStoreId(), banana, 40);
        await service.addProductTocart(ali_sessionId, store.getStoreId(), banana, 40);

        // avi buys 40 bananas successfully
        await service.checkoutBasket(avi_sessionId, store.getStoreId(), shippingInfo);
        await service.completeOrder(avi_sessionId, store.getStoreId(), payInfo, shippingInfo);
        
        try{
            let checkout_res =await service.checkoutBasket(ali_sessionId, store.getStoreId(), shippingInfo)
            assert.fail()
        }
        catch{
            // check that the basket of ali hasn't changed
            expect(ali.quantityInBasket(store.getStoreId(),banana)).to.equal(40)
            // chech that the store's inventory hasnt changed
            expect(store.getProductQuantity(banana)).to.equal(10)
            // check that transaction wasnt completed
            expect(Purchase.getAllTransactions().length).to.equal(1);
        }
    })

    it('parallel buy of last item',function () {
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
        service.checkoutBasket(ali_sessionId, store.getStoreId(), shippingInfo).catch( _ => {})
        service.checkoutBasket(avi_sessionId, store.getStoreId(), shippingInfo).catch( _ => {})
        
        //both avi and ali try to complete the order
        let ali_buy_res = service.completeOrder(ali_sessionId, store.getStoreId(), payInfo, shippingInfo);
        let avi_buy_res = service.completeOrder(avi_sessionId, store.getStoreId(), payInfo, shippingInfo);

        // here avi succeeds and ali fails to buy
        avi_buy_res.then(avi_buy => {
            ali_buy_res.then(ali_buy => {
                //only one purchase should succeed
                assert.fail()
            })
            ali_buy_res.catch(msg => {
                // if here avi succeeded and ali failed
                expect(avi.quantityInBasket(store.getStoreId(), banana_id)).to.equal(0)
                expect(ali.quantityInBasket(store.getStoreId(), banana_id)).to.equal(1)
                expect(store.getProductQuantity(banana_id)).to.equal(0);
                expect(Purchase.getAllTransactions().length).to.equal(1);
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
            })
            ali_buy_res.catch(msg => {
                //only one purchase should fail
                assert.fail()
            })})})})
            })})})})})})
    })
   
});