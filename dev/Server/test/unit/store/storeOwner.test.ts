import {expect} from 'chai';
import { Store } from '../../../src/DomainLayer/store/Store';
import { Login } from '../../../src/DomainLayer/user/Login';
import { SystemFacade } from '../../../src/DomainLayer/SystemFacade';
import { isFailure, isOk } from '../../../src/Result';
import { Service } from '../../../src/ServiceLayer/Service';


describe('Store owner manage store inventory' , () => {

    it('Owner adds valid product to inventory', () => {
        let service: Service = Service.get_instance()
        service.register("shir", "123")
        let res = Login.login("shir","123")
        if(isOk(res)){
            let store= new Store(res.value.getUserId(), 'nike', 123, 'Herzelyia leyad bbb')
            store.addCategoryToRoot('Shirt')
            store.addCategoryToRoot('Pants')
            store.addNewProduct(res.value, 'Dri-Fit Shirt', ['Shirt'], 100, 20)
            store.addNewProduct(res.value, 'Dri-Fit Pants', ['Pants'], 100, 15)
            expect(store.getStoreInfo().getStoreProducts()[0].getName()).to.equal('Dri-Fit Shirt')
            expect(store.getStoreInfo().getStoreProducts()[0].getPrice()).to.equal(100)
            expect(store.getStoreInfo().getStoreProducts()[1].getName()).to.equal('Dri-Fit Pants')
            expect(store.getStoreInfo().getStoreProducts()[1].getPrice()).to.equal(100)

        } else {
            expect(false).to.equal('Owner couldnt add products')
        }
    })

    it('Owner adds negative quantity of products to inventory', () => {
        let service: Service = Service.get_instance()
        service.register("shir", "123")
        let res = Login.login("shir","123")
        if(isOk(res)){
            let store= new Store(res.value.getUserId(), 'nike', 123, 'Herzelyia leyad bbb')
            let productRes = store.addNewProduct(res.value, 'Dri-Fit Shirt', ['Shirt'], 100, -20)
            expect(isFailure(productRes)).to.equal(true)

        } else {
            expect(false).to.equal('Owner could add a negative quantity of products')
        }
    })

});