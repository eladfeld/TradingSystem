import { assert, expect } from 'chai';
import { servicesVersion } from 'typescript';
import { isFailure, isOk, Result } from '../../src/Result';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store, SHIPPING_INFO, PAYMENT_INFO } from './common';
import SupplySystem from '../../src/DomainLayer/apis/SupplySystem';
import PaymentSystem from '../../src/DomainLayer/apis/PaymentSystem';
import { ProductDB } from '../../src/DomainLayer/store/ProductDB';
import { tPaymentInfo, tShippingInfo } from '../../src/DomainLayer/purchase/Purchase';


const payInfo : tPaymentInfo = { holder: "Rick" , id:244, cardNumber:123, expMonth:5, expYear:2024, cvv:123, toAccount: 1, amount: 100};
const shippingInfo: tShippingInfo = {name:"Rick", address:"kineret", city:"jerusalem", country:"israel", zip:8727};


import { APIsWillSucceed, failIfResolved, failTest, uniqueAviName, uniqueMegaName } from '../testUtil';
import {setReady, waitToRun} from '../testUtil';

describe('7.1: Api Fail', function () {

    var service: Service = Service.get_instance();
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });
    it('supply fail', async function () {
        SupplySystem.willFail();
        PaymentSystem.willSucceed();
        let sessionId = await service.enter();
        let avi =await register_login(service,sessionId, uniqueAviName(), "1234");
        let store =await open_store(service,sessionId, avi, uniqueMegaName(), 123456, "Tel aviv");
        await store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50);
        let apple = await service.addNewProduct(sessionId, store.getStoreId(), "apple", ['Sweet'], 1, 10);
        await service.addProductTocart(sessionId, store.getStoreId(), banana, 10);
        await service.addProductTocart(sessionId, store.getStoreId(), apple, 7);
        await service.checkoutBasket(sessionId, store.getStoreId(), SHIPPING_INFO);
        await failIfResolved(()=> service.completeOrder(sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO))
        }
    )

    it('payment fail', async function () {
        SupplySystem.willSucceed();
        PaymentSystem.willFail();
        let sessionId = await service.enter();
        let avi =await register_login(service,sessionId, uniqueAviName(), "1234");
        let store =await open_store(service,sessionId, avi, uniqueMegaName(), 123456, "Tel aviv");
        await store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50);
        let apple = await service.addNewProduct(sessionId, store.getStoreId(), "apple", ['Sweet'], 1, 10);
        await service.addProductTocart(sessionId, store.getStoreId(), banana, 10);
        await service.addProductTocart(sessionId, store.getStoreId(), apple, 7);
        await service.checkoutBasket(sessionId, store.getStoreId(), SHIPPING_INFO);
        await failIfResolved(()=> service.completeOrder(sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO))
    })

    // it('cart unchanged',async function () {
    //     SupplySystem.willSucceed();
    //     PaymentSystem.willFail();
    //     let sessionId = await service.enter();
    //     let avi =await register_login(service,sessionId, uniqueAviName(), "1234");
    //     let store =await open_store(service,sessionId, avi, uniqueMegaName(), 123456, "Tel aviv");
    //     await store.addCategoryToRoot('Sweet')
    //     let banana = await service.addNewProduct(sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50);
    //     let apple = await service.addNewProduct(sessionId, store.getStoreId(), "apple", ['Sweet'], 1, 10);
    //     await service.addProductTocart(sessionId, store.getStoreId(), banana, 10);
    //     await service.addProductTocart(sessionId, store.getStoreId(), apple, 7);
    //     await service.checkoutBasket(sessionId, store.getStoreId(), SHIPPING_INFO);

    //     await failIfResolved(()=> service.completeOrder(sessionId, store.getStoreId(), PAYMENT_INFO, SHIPPING_INFO))

    //     let cart_info = await service.getCartInfo(sessionId)
    //     let cart = JSON.parse( String(cart_info));
    //     expect(cart['baskets'][0]['products'].length).to.equal(2);
    //     expect(cart['baskets'][0]['products'].length).to.equal(2);//need to verify item quantities
    //     expect(cart['baskets'][0]['products'].length).to.equal(2);//need to verify item quantities
    // })

    // it('double checkout, inventory and basket editted once',async function () {
    //     SupplySystem.willSucceed();
    //     PaymentSystem.willFail();
    //     let sessionId = await service.enter();
    //     let avi =await register_login(service,sessionId, uniqueAviName(), "1234");
    //     let store =await open_store(service,sessionId, avi, uniqueMegaName(), 123456, "Tel aviv");
    //     await store.addCategoryToRoot('Sweet')
    //     let banana = await service.addNewProduct(sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50);
    //     let apple = await service.addNewProduct(sessionId, store.getStoreId(), "apple", ['Sweet'], 1, 20);
    //     await service.addProductTocart(sessionId, store.getStoreId(), banana, 10);
    //     await service.addProductTocart(sessionId, store.getStoreId(), apple, 10);
    //     await service.checkoutBasket(sessionId, store.getStoreId(), shippingInfo);
    //     await service.checkoutBasket(sessionId, store.getStoreId(), shippingInfo);
        
    //     try{
    //         let cartStr = await service.getCartInfo(sessionId)
    //         let cart = JSON.parse( String(cartStr));
    //         console.log(cart['baskets'][0]['products'][0]);
    //         expect(cart['baskets'][0]['products'].length).to.equal(2);
    //         expect(cart['baskets'][0]['products'][0]['quantity']).to.equal(10);
    //         expect(cart['baskets'][0]['products'][1]['quantity']).to.equal(10);
    //         expect(store.isProductAvailable((await ProductDB.getProductByName('banana')).getProductId(), 40)).to.equal(true);
    //         expect(store.isProductAvailable((await ProductDB.getProductByName('banana')).getProductId(), 41)).to.equal(false);
    //         expect(store.isProductAvailable((await ProductDB.getProductByName('apple')).getProductId(), 10)).to.equal(true);
    //         expect(store.isProductAvailable((await ProductDB.getProductByName('apple')).getProductId(), 11)).to.equal(false);
    //     }
    //     catch{failTest("cart doesnt have proper structure")}
            
    // })
});