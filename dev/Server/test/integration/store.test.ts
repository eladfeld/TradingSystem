import {expect} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { Login } from '../../src/DomainLayer/user/Login';
import { Service } from '../../src/ServiceLayer/Service';
import { ShoppingBasket } from '../../src/DomainLayer/user/ShoppingBasket';
import { tPredicate } from '../../src/DomainLayer/discount/logic/Predicate';
import BuyingSubject from '../../src/DomainLayer/policy/buying/BuyingSubject';
import { tPaymentInfo, tShippingInfo } from '../../src/DomainLayer/purchase/Purchase';


const payInfo : tPaymentInfo = { holder: "Rick" , id:244, cardNumber:123, expMonth:5, expYear:2024, cvv:123, toAccount: 1, amount: 100};

const shippingInfo: tShippingInfo = {name:"Rick", address:"kineret", city:"jerusalem", country:"israel", zip:8727};

import { APIsWillSucceed, failIfRejected, HASHED_PASSWORD, uniqueName } from '../testUtil';
import { SHIPPING_INFO } from '../acceptence/common';
import {setReady, waitToRun} from '../testUtil';

describe('view store products' , () => {

    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });

    afterEach(function () {
        //console.log('finish');
        setReady(true);
    });

    // it('view store without products', () => {
    //     let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
    //     expect(store.getStoreInfo().getStoreName()).to.equal('nike')
    //     expect(store.getStoreInfo().getStoreId()).to.equal(store.getStoreId())
    // })

    it('view store with products', async() => {
        Service.get_instance()
        //let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        let manager = await Login.login(uniqueName("michael"), '1234')
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        await store.addCategoryToRoot('Shirt')
        await store.addCategoryToRoot('Pants')
        await failIfRejected(() => store.addNewProduct(manager, 'Dri-Fit Shirt', ['Shirt'], 100, 20,""));
        await store.addNewProduct(manager, 'Dri-Fit Pants', ['Pants'], 100, 15,"")
        expect(store.getStoreInfo().getStoreName()).to.equal('nike')
        expect(store.getStoreInfo().getStoreId()).to.equal(store.getStoreId())
        expect(store.getStoreInfo().getStoreProducts()[0].getName()).to.equal('Dri-Fit Shirt')
        expect(store.getStoreInfo().getStoreProducts()[0].getPrice()).to.equal(100)
        expect(store.getStoreInfo().getStoreProducts()[1].getName()).to.equal('Dri-Fit Pants')
        expect(store.getStoreInfo().getStoreProducts()[1].getPrice()).to.equal(100)
    })

});

describe('search product in store' , () => {

    it('search product by name', async() => {
        Service.get_instance()
        let manager = await Login.login(uniqueName('michael'), '1234')
        let store = new Store(1, uniqueName('nike'), 123, 'Herzelyia leyad bbb')
        await store.addCategoryToRoot('Shirt')
        await store.addCategoryToRoot('Pants')
        await store.addNewProduct(manager, 'Dri-Fit Shirt', ['Shirt'], 120, 20,"")
        await store.addNewProduct(manager, 'Dri-Fit Pants', ['Pants'], 100, 15,"")
        let shirtInfo = store.searchByName('Dri-Fit Shirt')
        let pantsInfo = store.searchByName('Dri-Fit Pants')
        expect(shirtInfo[0].getName()).to.equal('Dri-Fit Shirt')
        expect(shirtInfo[0].getPrice()).to.equal(120)
        expect(pantsInfo[0].getName()).to.equal('Dri-Fit Pants')
        expect(pantsInfo[0].getPrice()).to.equal(100)
    })

    it('search product by category', async() => {
        Service.get_instance()
        let manager = await Login.login(uniqueName('michael'), '1234')
        let store = new Store(1, uniqueName('nike'), 123, 'Herzelyia leyad bbb')
        await store.addCategoryToRoot('Shirt')
        await store.addCategoryToRoot('Pants')
        await store.addNewProduct(manager, 'Dri-Fit Shirt', ['Shirt'], 120, 20,"")
        await store.addNewProduct(manager, 'Dri-Fit Pants', ['Pants'], 100, 15,"")
        let shirtInfo = store.searchByCategory('Shirt')
        let pantsInfo = store.searchByName('Dri-Fit Pants')
        expect(shirtInfo[0].getName()).to.equal('Dri-Fit Shirt')
        expect(shirtInfo[0].getPrice()).to.equal(120)
        expect(pantsInfo[0].getName()).to.equal('Dri-Fit Pants')
        expect(pantsInfo[0].getPrice()).to.equal(100)
    })

    describe('buying against policy' , () => {
        it('buying against policy', async() => {
            Service.get_instance()
            let manager = await Login.login(uniqueName('michael'), '1234')
            let subsriber = new Subscriber(uniqueName('something'),HASHED_PASSWORD, 13)
            const store1: Store = new Store(subsriber.getUserId(),'store1', 12345678,"1 sunny ave");
            await store1.addCategoryToRoot('alcohol')
            const user1Id: number = 100;
            const user1Adrs: string = "8 Mile Road, Detroit";
            let productId = await store1.addNewProduct(manager, 'Jack Daniels', ['alcohol'], 80, 20,"")
            const basket1a: ShoppingBasket = new ShoppingBasket (store1);
            await basket1a.addProduct(productId, 1);
            const policy:tPredicate = {type:"simple",operand1:0,operator:"<",operand2:1};
            const policyRes = await store1.addBuyingPolicy(subsriber,"no one buys anything", policy);
            const buyingSubject = new BuyingSubject(subsriber, basket1a);
            await store1.sellShoppingBasket(user1Id, SHIPPING_INFO,basket1a, buyingSubject, ()=>{})
        })

    })

});