import {expect} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Category, Rating } from "../../src/DomainLayer/store/Common";


describe('view store and its products (use case 2.5)' , () => {

    it('view store without products', () => {
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        expect(store.getStoreInfo().getStoreName()).to.equal('nike')
        expect(store.getStoreInfo().getStoreId()).to.equal(store.getStoreId())
    })

    it('view store with products', () => {
        let store = new Store(1, 'nike', 123, 'Herzelyia leyad bbb')
        let res = store.addNewProduct('Dri-Fit Shirt', [Category.SHIRT], 100, 20)
        store.addNewProduct('Dri-Fit Pants', [Category.PANTS], 100, 15)
        expect(store.getStoreInfo().getStoreName()).to.equal('nike')
        expect(store.getStoreInfo().getStoreId()).to.equal(store.getStoreId())
        expect(store.getStoreInfo().getStoreProducts()[0].getName()).to.equal('Dri-Fit Shirt')
        expect(store.getStoreInfo().getStoreProducts()[0].getPrice()).to.equal(100)
        expect(store.getStoreInfo().getStoreProducts()[1].getName()).to.equal('Dri-Fit Pants')
        expect(store.getStoreInfo().getStoreProducts()[1].getPrice()).to.equal(100)
    })

});