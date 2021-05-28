import {expect} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { Login } from '../../src/DomainLayer/user/Login';
import { SystemFacade } from '../../src/DomainLayer/SystemFacade';
import { isFailure, isOk, Result } from '../../src/Result';
import { StoreProductInfo } from '../../src/DomainLayer/store/StoreInfo';
import { Service } from '../../src/ServiceLayer/Service';
import { ShoppingBasket } from '../../src/DomainLayer/user/ShoppingBasket';
import BuyingPolicy from '../../src/DomainLayer/policy/buying/BuyingPolicy';
import { tPredicate } from '../../src/DomainLayer/discount/logic/Predicate';
import BuyingSubject from '../../src/DomainLayer/policy/buying/BuyingSubject';
import { tPaymentInfo, tShippingInfo } from '../../src/DomainLayer/purchase/Purchase';

const payInfo : tPaymentInfo = { holder: "Rick" , id:244, cardNumber:123, expMonth:5, expYear:2024, cvv:123, toAccount: 1, amount: 100};

const shippingInfo: tShippingInfo = {name:"Rick", address:"kineret", city:"jerusalem", country:"israel", zip:8727};



describe('view store products' , () => {

    // it('view store without products', () => {
    //     let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
    //     expect(store.getStoreInfo().getStoreName()).to.equal('nike')
    //     expect(store.getStoreInfo().getStoreId()).to.equal(store.getStoreId())
    // })

    it('view store with products', () => {
        Service.get_instance()
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        let manager = Login.login('michael', '1234')
        if(isOk(manager)){
            let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
            store.addCategoryToRoot('Shirt')
            store.addCategoryToRoot('Pants')
            expect(isOk(store.addNewProduct(manager.value, 'Dri-Fit Shirt', ['Shirt'], 100, 20))).to.equal(true)
            store.addNewProduct(manager.value, 'Dri-Fit Pants', ['Pants'], 100, 15)
            expect(store.getStoreInfo().getStoreName()).to.equal('nike')
            expect(store.getStoreInfo().getStoreId()).to.equal(store.getStoreId())
            expect(store.getStoreInfo().getStoreProducts()[0].getName()).to.equal('Dri-Fit Shirt')
            expect(store.getStoreInfo().getStoreProducts()[0].getPrice()).to.equal(100)
            expect(store.getStoreInfo().getStoreProducts()[1].getName()).to.equal('Dri-Fit Pants')
            expect(store.getStoreInfo().getStoreProducts()[1].getPrice()).to.equal(100)
        } else {
            expect(false).to.equal('manager login failed')
        }
    })

});

describe('search product in store' , () => {

    it('search product by name', () => {
        Service.get_instance()
        let manager = Login.login('michael', '1234')
        if(isOk(manager)){
            let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
            store.addCategoryToRoot('Shirt')
            store.addCategoryToRoot('Pants')
            store.addNewProduct(manager.value, 'Dri-Fit Shirt', ['Shirt'], 120, 20)
            store.addNewProduct(manager.value, 'Dri-Fit Pants', ['Pants'], 100, 15)
            let shirtInfo = store.searchByName('Dri-Fit Shirt')
            let pantsInfo = store.searchByName('Dri-Fit Pants')
            expect(shirtInfo[0].getName()).to.equal('Dri-Fit Shirt')
            expect(shirtInfo[0].getPrice()).to.equal(120)
            expect(pantsInfo[0].getName()).to.equal('Dri-Fit Pants')
            expect(pantsInfo[0].getPrice()).to.equal(100)

        } else {
            expect(false).to.equal('Search by name failed')
        }
    })

    it('search product by category', () => {
        Service.get_instance()
        let manager = Login.login('michael', '1234')
        if(isOk(manager)){
            let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
            store.addCategoryToRoot('Shirt')
            store.addCategoryToRoot('Pants')
            store.addNewProduct(manager.value, 'Dri-Fit Shirt', ['Shirt'], 120, 20)
            store.addNewProduct(manager.value, 'Dri-Fit Pants', ['Pants'], 100, 15)
            let shirtInfo = store.searchByCategory('Shirt')
            let pantsInfo = store.searchByName('Dri-Fit Pants')
            expect(shirtInfo[0].getName()).to.equal('Dri-Fit Shirt')
            expect(shirtInfo[0].getPrice()).to.equal(120)
            expect(pantsInfo[0].getName()).to.equal('Dri-Fit Pants')
            expect(pantsInfo[0].getPrice()).to.equal(100)

        } else {
            expect(false).to.equal('Search by category failed')
        }
    })

    describe('buying against policy' , () => {
        it('buying against policy', () => {
            Service.get_instance()
            let manager = Login.login('michael', '1234')
            if(isOk(manager)){
                let subsriber = new Subscriber('something', 13)
                const store1: Store = new Store(subsriber.getUserId(),'store1', 12345678,"1 sunny ave");
                store1.addCategoryToRoot('alcohol')
                const user1Id: number = 100;
                const user1Adrs: string = "8 Mile Road, Detroit";
                let res = store1.addNewProduct(manager.value, 'Jack Daniels', ['alcohol'], 80, 20)
                if (isOk(res)){
                    const basket1a: ShoppingBasket = new ShoppingBasket (store1);
                    basket1a.addProduct(res.value, 1);
                    const policy:tPredicate = {type:"simple",operand1:0,operator:"<",operand2:1};
                    const policyRes = store1.addBuyingPolicy(subsriber,"no one buys anything", policy);
                    expect(isOk(policyRes)).to.equal(true);
                    const buyingSubject = new BuyingSubject(subsriber, basket1a);

                    let sellRes = store1.sellShoppingBasket(user1Id, shippingInfo,basket1a, buyingSubject, ()=>{})
                    // expect(isFailure(sellRes)).to.equal(true)
                }

            } else {
                expect(false).to.equal('buying against policy shouldve failed')
            }
        })

    })

});