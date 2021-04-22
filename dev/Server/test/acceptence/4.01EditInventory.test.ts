import {assert, expect} from 'chai';
import { Category } from '../../src/DomainLayer/store/Common';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';

describe('4.1: edit store inventory' , function() {

        it('edit non existent product ' , function() {
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
                let subscriber : Subscriber = login_res.value;
                let storeRes: Result<Store> = service.openStore(subscriber.getUserId() , "Aluf Hasport" , 123456 , "Tel Aviv" );
                if(isOk(storeRes))
                {
                    let product1: Product = new Product("banana", [Category.SWEET]); 
                    expect(isOk(service.editStoreInventory(subscriber.getUserId(), storeRes.value.getStoreId(), product1.getProductId(), 10))).to.equal(false);
                }
                else assert.fail();
            }
            else assert.fail();
        }
        else assert.fail();
        
    }) 

    it('edit existing product' , function() {
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
                let subscriber : Subscriber = login_res.value;
                let storeRes: Result<Store> = service.openStore(subscriber.getUserId() , "Aluf Hasport" , 123456 , "Tel Aviv" );
                if(isOk(storeRes))
                {
                    let productId = service.addNewProduct(subscriber.getUserId(), storeRes.value.getStoreId(), "banana", [Category.SWEET], 12, 100);
                    if (isOk(productId))
                    {
                        expect(isOk(service.editStoreInventory(subscriber.getUserId(), storeRes.value.getStoreId(), productId.value, 10))).to.equal(true);
                    }
                    else assert.fail();
                }
                else assert.fail();
            }
            else assert.fail();

        }
        else assert.fail();
        
    }) 





});