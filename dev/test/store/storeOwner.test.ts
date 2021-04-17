import {expect} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Category, Rating } from "../../src/DomainLayer/store/Common";
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { Login } from '../../src/DomainLayer/user/Login';
import { Service } from '../../src/ServiceLayer/Service';
import { isFailure, isOk } from '../../src/Result';
import { StoreProductInfo } from '../../src/DomainLayer/store/StoreInfo';
import { Appointment } from '../../src/DomainLayer/user/Appointment';


describe('Store owner manage store inventory (use case 4.1)' , () => {

    it('Owner adds valid product to inventory', () => {
        let service = Service.get_instance()
        service.register("shir", "123")
        let res = Login.login("shir","123")
        if(isOk(res)){
            let store= new Store(res.value.getUserId(), 'nike', 123, 'Herzelyia leyad bbb')
            store.addNewProduct(res.value, 'Dri-Fit Shirt', [Category.SHIRT], 100, 20)
            store.addNewProduct(res.value, 'Dri-Fit Pants', [Category.PANTS], 100, 15)
            expect(store.getStoreInfo().getStoreProducts()[0].getName()).to.equal('Dri-Fit Shirt')
            expect(store.getStoreInfo().getStoreProducts()[0].getPrice()).to.equal(100)
            expect(store.getStoreInfo().getStoreProducts()[1].getName()).to.equal('Dri-Fit Pants')
            expect(store.getStoreInfo().getStoreProducts()[1].getPrice()).to.equal(100)
           
        } else {
            expect(false).to.equal('Owner couldnt add products')
        }
    })

    it('Owner adds negative quantity of products to inventory', () => {
        let service = Service.get_instance()
        service.register("shir", "123")
        let res = Login.login("shir","123")
        if(isOk(res)){
            let store= new Store(res.value.getUserId(), 'nike', 123, 'Herzelyia leyad bbb')
            let productRes = store.addNewProduct(res.value, 'Dri-Fit Shirt', [Category.SHIRT], 100, -20)
            expect(isFailure(productRes)).to.equal(true)
        
        } else {
            expect(false).to.equal('Owner could add a negative quantity of products')
        }
    })

});

describe('Store owner adds a new store manager (use case 4.5)' , () => {

    it('Owner adds valid product to inventory', () => {
        let service = Service.get_instance()
        service.register("shir", "123")
        let resShir = Login.login("shir","123")
        service.register("alon", "123")
        let resAlon = Login.login("alon","123")
        if(isOk(resShir)&& isOk(resAlon)){
            let store= new Store(resShir.value.getUserId(), 'nike', 123, 'Herzelyia leyad bbb')
            store.appointStoreManager(resShir.value,resAlon.value)
            let app = store.findAppointedBy(resShir.value.getUserId(), resAlon.value.getUserId())
            expect(app.getAppointee().getUserId).to.equal(resAlon.value.getUserId())
            expect(app.getAppointer().getUserId).to.equal(resShir.value.getUserId())
           
        } else {
            expect(false).to.equal('Failed to login')
        }
    })

    it('Owner tries to appoint same manager twice', () => {
        let service = Service.get_instance()
        service.register("shir", "123")
        let resShir = Login.login("shir","123")
        service.register("alon", "123")
        let resAlon = Login.login("alon","123")
        if(isOk(resShir)&& isOk(resAlon)){
            let store= new Store(resShir.value.getUserId(), 'nike', 123, 'Herzelyia leyad bbb')
            store.appointStoreManager(resShir.value,resAlon.value)
            expect(isFailure(store.appointStoreManager(resShir.value,resAlon.value))).to.equal(true)
            
        } else {
            expect(false).to.equal('Failed to login')
        }
    })
})

describe('Store owner adds a new store owner (use case 4.3)' , () => {

    it('Owner adds valid product to inventory', () => {
        let service = Service.get_instance()
        service.register("shir", "123")
        let resShir = Login.login("shir","123")
        service.register("alon", "123")
        let resAlon = Login.login("alon","123")
        if(isOk(resShir)&& isOk(resAlon)){
            let store= new Store(resShir.value.getUserId(), 'nike', 123, 'Herzelyia leyad bbb')
            store.appointStoreOwner(resShir.value,resAlon.value)
            let app = store.findAppointedBy(resShir.value.getUserId(), resAlon.value.getUserId())
            expect(app.getAppointee().getUserId).to.equal(resAlon.value.getUserId())
            expect(app.getAppointer().getUserId).to.equal(resShir.value.getUserId())
           
        } else {
            expect(false).to.equal('Failed to login')
        }
    })

    it('Owner adds valid product to inventory', () => {
        let service = Service.get_instance()
        service.register("shir", "123")
        let resShir = Login.login("shir","123")
        service.register("alon", "123")
        let resAlon = Login.login("alon","123")
        if(isOk(resShir)&& isOk(resAlon)){
            let store= new Store(resShir.value.getUserId(), 'nike', 123, 'Herzelyia leyad bbb')
            store.appointStoreOwner(resShir.value,resAlon.value)
            expect(isFailure(store.appointStoreOwner(resShir.value,resAlon.value))).to.equal(true)
            
        } else {
            expect(false).to.equal('Failed to login')
        }
    })
})