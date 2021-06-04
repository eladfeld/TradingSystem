import { assert, expect } from 'chai';
import Purchase, { tPaymentInfo, tShippingInfo } from '../../src/DomainLayer/purchase/Purchase';
import { Service } from '../../src/ServiceLayer/Service';
import { APIsWillSucceed, failIfResolved, uniqueAviName, uniqueMegaName, uniqueMosheName, uniqueName } from '../testUtil';
import { register_login, open_store, SHIPPING_INFO, PAYMENT_INFO } from './common';

declare interface PromiseConstructor {
    allSettled(promises: Array<Promise<any>>): Promise<Array<{ status: 'fulfilled' | 'rejected', value?: any, reason?: any }>>;
}

const payInfo : tPaymentInfo = { holder: "Rick" , id:244, cardNumber:123, expMonth:5, expYear:2024, cvv:123, toAccount: 1, amount: 100};

const shippingInfo: tShippingInfo = {name:"Rick", address:"kineret", city:"jerusalem", country:"israel", zip:8727};
import {setReady, waitToRun} from '../testUtil';
import { Publisher } from '../../src/DomainLayer/notifications/Publisher';
import { promises } from 'dns';

describe('2.9.3: Live Messages', function () {
    //setTestConfigurations();        //changing external APIs to mocks
    var service: Service = Service.get_instance();

    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });

    it('avi buys from himself and receives message', async function () {
        var publisher : Publisher = Publisher.get_instance();
        publisher.set_send_func((userId:number,_message:{}) => {
            return Promise.resolve("message sent")
        })

        let avi_sessionId = await service.enter()
        let avi = await register_login(service, avi_sessionId, uniqueAviName(), "1234");
        let store = await open_store(service, avi_sessionId, avi, uniqueMegaName(), 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(avi_sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50);
        let apple = await service.addNewProduct(avi_sessionId, store.getStoreId(), "apple", ['Sweet'], 1, 10);
        await service.addProductTocart(avi_sessionId, store.getStoreId(), banana, 10);
        await service.addProductTocart(avi_sessionId, store.getStoreId(), apple, 7);
        await service.checkoutBasket(avi_sessionId, store.getStoreId(), shippingInfo);
        let purchase_res = await service.completeOrder(avi_sessionId, store.getStoreId(), payInfo, shippingInfo)

        expect(purchase_res).to.equal(true)
        
        expect(avi.getMessageHistory().length).to.equal(1)
    })


    it('moshe buys from avi which receives the message only after he logs in', async function () {
        var publisher : Publisher = Publisher.get_instance();
        publisher.set_send_func((userId:number,_message:{}) => {
            let logged_subscribers = service.get_logged_subscribers()
            for(const subcriber of logged_subscribers.values())
            {
                if(subcriber.getUserId() === userId)
                    return Promise.resolve("message sent")
            }
            return Promise.reject("user not logged in")
        })

        let avi_sessionId = await service.enter()
        let moshe_sessionId = await service.enter()

        let avi_unique_name = uniqueAviName()
        let avi = await register_login(service, avi_sessionId, avi_unique_name, "1234");
        let moshe = await register_login(service, moshe_sessionId , uniqueMosheName() , "1234")

        let store = await open_store(service, avi_sessionId, avi, uniqueMegaName(), 123456, "Tel aviv");
        store.addCategoryToRoot('Sweet')
        let banana = await service.addNewProduct(avi_sessionId, store.getStoreId(), "banana", ['Sweet'], 1, 50);
        service.logout(avi_sessionId)

        await service.addProductTocart(moshe_sessionId, store.getStoreId(), banana, 10);
        await service.checkoutBasket(moshe_sessionId, store.getStoreId(), shippingInfo);
        let purchase_res = await service.completeOrder(moshe_sessionId, store.getStoreId(), payInfo, shippingInfo)
        
        expect(avi.getMessageHistory().length).to.equal(0)
        avi = await service.login(avi_sessionId, avi_unique_name, "1234")
        setTimeout( () => {
            expect(avi.getMessageHistory().length).to.equal(1) 
        }, 2000)
    })

    

});