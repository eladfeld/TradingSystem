import {expect} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { Login } from '../../src/DomainLayer/user/Login';
import { isFailure, isOk } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service';
import { Register } from '../../src/DomainLayer/user/Register';
import { APIsWillSucceed, failIfRejected, failIfResolved, failTestFromError, uniqueName } from '../testUtil';
import {setReady, waitToRun} from '../testUtil';


describe('Store owner manage store inventory' , () => {
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });

    it('Owner adds valid product to inventory', async() => {
        const shirName = uniqueName("shir")
        let service: Service =await Service.get_instance()
        await failIfRejected(()=> service.register(shirName, "123",13));
        let subscriber = await failIfRejected(()=> Login.login(shirName,"123"));
            let store= new Store(subscriber.getUserId(), 'nike', 123, 'Herzelyia leyad bbb');
            try{
                await store.addCategoryToRoot('Shirt');
                await store.addCategoryToRoot('Pants');
                await store.addNewProduct(subscriber, 'Dri-Fit Shirt', ['Shirt'], 100, 20,"");
                await store.addNewProduct(subscriber, 'Dri-Fit Pants', ['Pants'], 100, 15,"");
            }catch(e){
                failTestFromError(e);
            }   
            expect(store.getStoreInfo().getStoreProducts()[0].getName()).to.equal('Dri-Fit Shirt')
            expect(store.getStoreInfo().getStoreProducts()[0].getPrice()).to.equal(100)
            expect(store.getStoreInfo().getStoreProducts()[1].getName()).to.equal('Dri-Fit Pants')
            expect(store.getStoreInfo().getStoreProducts()[1].getPrice()).to.equal(100)
    })

    it('Owner adds negative quantity of products to inventory', async() => {
        const shirName = uniqueName("shir");
        let service: Service =await Service.get_instance()
        await Register.register(shirName, "123", 13)
        let subscriber = await Login.login(shirName,"123")
        let store = new Store(subscriber.getUserId(), uniqueName('nike'), 123, 'Herzelyia leyad bbb')
        await failIfResolved(()=> store.addNewProduct(subscriber, 'Dri-Fit Shirt', ['Shirt'], 100, -20,""))
    })

});