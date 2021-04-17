import {expect} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Category, Rating } from "../../src/DomainLayer/store/Common";
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { Login } from '../../src/DomainLayer/user/Login';
import { Service } from '../../src/ServiceLayer/Service';
import { isOk } from '../../src/Result';
import { StoreProductInfo } from '../../src/DomainLayer/store/StoreInfo';


describe('view store and its products (use case 2.5)' , () => {

    it('view store without products', () => {
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        expect(store.getStoreInfo().getStoreName()).to.equal('nike')
        expect(store.getStoreInfo().getStoreId()).to.equal(store.getStoreId())
    })

    it('view store with products', () => {
        Service.get_instance()
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        let manager = Login.login('michael', '1234')
        if(isOk(manager)){
            let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
            let res = store.addNewProduct(manager.value, 'Dri-Fit Shirt', [Category.SHIRT], 100, 20)
            store.addNewProduct(manager.value, 'Dri-Fit Pants', [Category.PANTS], 100, 15)
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

describe('search in store (use case 2.6)' , () => {

    it('search product by name', () => {
        Service.get_instance()
        let manager = Login.login('michael', '1234')
        if(isOk(manager)){
            let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
            store.addNewProduct(manager.value, 'Dri-Fit Shirt', [Category.SHIRT], 120, 20)
            store.addNewProduct(manager.value, 'Dri-Fit Pants', [Category.PANTS], 100, 15)
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
            store.addNewProduct(manager.value, 'Dri-Fit Shirt', [Category.SHIRT], 120, 20)
            store.addNewProduct(manager.value, 'Dri-Fit Pants', [Category.PANTS], 100, 15)
            let shirtInfo = store.searchByCategory(Category.SHIRT)
            let pantsInfo = store.searchByName('Dri-Fit Pants')
            expect(shirtInfo[0].getName()).to.equal('Dri-Fit Shirt')
            expect(shirtInfo[0].getPrice()).to.equal(120)
            expect(pantsInfo[0].getName()).to.equal('Dri-Fit Pants')
            expect(pantsInfo[0].getPrice()).to.equal(100)

        } else {
            expect(false).to.equal('Search by category failed')
        }
    })

});