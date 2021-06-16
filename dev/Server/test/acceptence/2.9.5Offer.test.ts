import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store, SHIPPING_INFO, PAYMENT_INFO } from './common';
import Purchase, { tPaymentInfo, tShippingInfo } from '../../src/DomainLayer/purchase/Purchase';
import { expect } from 'chai';


const payInfo : tPaymentInfo = { holder: "Rick" , id:244, cardNumber:123, expMonth:5, expYear:2024, cvv:123, toAccount: 1, amount: 100};
const shippingInfo: tShippingInfo = {name:"Rick", address:"kineret", city:"jerusalem", country:"israel", zip:8727};


import { APIsWillSucceed, uniqueAviName, uniqueMegaName } from '../testUtil';
import {setReady, waitToRun} from '../testUtil';
import { DB } from '../../src/DataAccessLayer/DBfacade';

describe('Offer tests',function () {


    beforeEach( () => {
        return waitToRun(()=>APIsWillSucceed());
    });

    afterEach(function () {
        setReady(true);
    });
    it('accept offer and buy', async function () {
        this.timeout(100000)
        var service: Service =await Service.get_instance();
        let sessionIdOwner = await service.enter();
        let sessionIdBuyer = await service.enter();

        // login owner and buyer
        let avi =await register_login(service,sessionIdOwner, uniqueAviName(), "1234");
        let mega =await register_login(service,sessionIdBuyer, uniqueMegaName(), "1234");

        // open a store and add product
        let store =await open_store(service,sessionIdOwner, avi, uniqueMegaName(), 123456, "Tel aviv");
        let banana = await service.addNewProduct(sessionIdOwner, store.getStoreId(), "banana", [], 15, 50,"");

        // set store to recieve offers
        await service.setStoreToRecieveOffers(store.getStoreId())

        // buyer submit offer for banana
        await service.newOffer(sessionIdBuyer, store.getStoreId(), banana, 10);
        let offers = await service.getOffersByStore(store.getStoreId())
        console.log(offers)
        let offerId = offers[0].getOfferId()

        // owner accepts offer
        await service.acceptOffer(sessionIdOwner, store.getStoreId(), offerId);

        // buy offer
        await service.buyAcceptedOffer(sessionIdBuyer, store.getStoreId(), offerId);
        await service.completeOrder(sessionIdBuyer, store.getStoreId(), PAYMENT_INFO,SHIPPING_INFO);

        // offer status should be purchased
        offers = await service.getOffersByStore(store.getStoreId());
        expect(offers[0].getOfferStatus()).to.equal("PURCHASED");

        // check store inventory updated successfully
        store = await DB.getStoreByID(store.getStoreId())
        expect(store.getProductQuantity(banana)).to.equal(49)

        // if transaction completed then the external systems were activated
        await Purchase.getCompletedTransactionsForUser(mega.getUserId())
    })

    it('decline offer fail buying', async function () {
        this.timeout(100000)
        var service: Service =await Service.get_instance();
        let sessionIdOwner = await service.enter();
        let sessionIdBuyer = await service.enter();

        // login owner and buyer
        let avi =await register_login(service,sessionIdOwner, uniqueAviName(), "1234");
        let mega =await register_login(service,sessionIdBuyer, uniqueMegaName(), "1234");

        // open a store and add product
        let store =await open_store(service,sessionIdOwner, avi, uniqueMegaName(), 123456, "Tel aviv");
        let banana = await service.addNewProduct(sessionIdOwner, store.getStoreId(), "banana", [], 15, 50,"");

        // set store to recieve offers
        await service.setStoreToRecieveOffers(store.getStoreId())

        // buyer submit offer for banana
        await service.newOffer(sessionIdBuyer, store.getStoreId(), banana, 10);
        let offers = await service.getOffersByStore(store.getStoreId())
        let offerId = offers[0].getOfferId()

        // owner declines offer
        await service.declineOffer(sessionIdOwner, store.getStoreId(), offerId);

        // buy offer
        await service.buyAcceptedOffer(sessionIdBuyer, store.getStoreId(), offerId);

        // offer status should be declined
        offers = await service.getOffersByStore(store.getStoreId());
        expect(offers[0].getOfferStatus()).to.equal("DECLINED");

        // check store inventory didn't change
        store = await DB.getStoreByID(store.getStoreId())
        expect(store.getProductQuantity(banana)).to.equal(50)

        // if transaction completed then the external systems were activated
        await Purchase.getCompletedTransactionsForUser(mega.getUserId())
    })
})