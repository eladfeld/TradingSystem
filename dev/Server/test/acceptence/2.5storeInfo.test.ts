import {Assertion, expect , assert} from 'chai';
import { Category } from '../../src/DomainLayer/store/Common';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import {Service} from '../../src/ServiceLayer/Service'

describe('2.5: store info test' , function() {

    it('store info test good' , function() {
        Authentication.clean();
        let service: Service = Service.get_instance();
        service.clear();
        let enter_res = service.enter();
        if (isOk(enter_res))
        {
            service.register("avi", "123456789");
            let login_res: Result<Subscriber> = service.login(enter_res.value, "avi", "123456789");
            if(isOk(login_res))
            {
                let subscriber: Subscriber = login_res.value;
                let store1:Result<Store> = service.openStore(subscriber.getUserId(), "aluf hasport" , 123456 , "Tel Aviv");
                let store2:Result<Store> = service.openStore(subscriber.getUserId(), "mega" , 123456 , "Tel Aviv");
                if (isOk(store1) && isOk(store2))
                {
                    service.addNewProduct(subscriber.getUserId() , store1.value.getStoreId() , "Apple" , [Category.SHIRT] , 26 , 10);
                    service.addNewProduct(subscriber.getUserId(), store2.value.getStoreId() , "banana" , [Category.SHIRT] , 26 , 20);
                    expect(isOk(service.getStoreInfo(subscriber.getUserId() , store1.value.getStoreId()))).to.equal(true);
                }
                else assert.fail();
            }
            else assert.fail();
        }
        else assert.fail();
    })    

    it('try to watch store without permission' , function() {
        Authentication.clean();
        let service: Service = Service.get_instance();
        service.clear();
        let enter_res = service.enter();
        if (isOk(enter_res))
        {
            service.register("avi", "123456789");
            let login_res: Result<Subscriber> = service.login(enter_res.value, "avi", "123456789");
            if(isOk(login_res))
            {
                let subscriber: Subscriber = login_res.value;
                let store1:Result<Store> = service.openStore(subscriber.getUserId(), "aluf hasport" , 123456 , "Tel Aviv");
                let store2:Result<Store> = service.openStore(subscriber.getUserId(), "mega" , 123456 , "Tel Aviv");
                if (isOk(store1) && isOk(store2))
                {
                    service.addNewProduct(subscriber.getUserId() , store1.value.getStoreId() , "Apple" , [Category.SHIRT] , 26 , 10);
                    service.addNewProduct(subscriber.getUserId(), store2.value.getStoreId() , "banana" , [Category.SHIRT] , 26 , 20);
                    expect(isOk(service.getStoreInfo(subscriber.getUserId() + 1 , store1.value.getStoreId()))).to.equal(false);
                }
                else assert.fail();
            }
            else assert.fail();
        }
        else assert.fail();
    })

    it('avi opens store , system manager watching it' , function() {
        let store1 = undefined;
        Authentication.clean();
        let service: Service = Service.get_instance();
        service.clear();
        //----------------avi opens store---------------------------------
        let enter_res = service.enter();
        if (isOk(enter_res))
        {
            service.register("avi", "123456789");
            let login_res: Result<Subscriber> = service.login(enter_res.value, "avi", "123456789");
            if(isOk(login_res))
            {
                let subscriber: Subscriber = login_res.value;
                store1 = service.openStore(subscriber.getUserId(), "aluf hasport" , 123456 , "Tel Aviv");
                if (isOk(store1))
                {
                    service.addNewProduct(subscriber.getUserId() , store1.value.getStoreId() , "Apple" , [Category.SHIRT] , 26 , 10);
                }
            }
        }
        //----------------------------------------------------------------


        //-----------------system manager watches-------------------------
        enter_res = service.enter();
        if(isOk(enter_res))
        {
            let login_res: Result<Subscriber> = service.login(enter_res.value, "michael", "1234");
            if (isOk(login_res))
            {
                let subscriber: Subscriber = login_res.value;
                if (isOk(store1))
                    expect(isOk(service.getStoreInfo(subscriber.getUserId() , store1.value.getStoreId()))).to.equal(true);
                else assert.fail();
            }
            else assert.fail();
        }
        else assert.fail();
        //---------------------------------------------------------------
    })    


});