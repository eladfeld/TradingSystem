import {expect} from 'chai';
import { Category } from '../../src/DomainLayer/store/Common';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';

describe('2.7: add to cart test' , function() {

    it('add to cart good' , function() {
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
                let subscriber : Subscriber = login_res.value
                let store1 : Result<Store> = service.openStore(subscriber.getUserId() , "Aluf Hasport" , 123456 , "Tel Aviv" );
                if (isOk(store1))
                {
                    let product1: Product = new Product("banana", [Category.SWEET]);
                    store1.value.addNewProduct(subscriber,product1.getName(),[Category.COMPUTER],500,100);
                    expect(isOk(service.addProductTocart(subscriber.getUserId(), store1.value.getStoreId() , product1.getProductId() , 10))).to.equal(true);                    
                }
            }

        }
        
    }) 

    it('add non existent product to cart' , function() {
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
                let subscriber : Subscriber = login_res.value
                let store1 : Result<Store> = service.openStore(subscriber.getUserId() , "Aluf Hasport" , 123456 , "Tel Aviv" );
                if (isOk(store1))
                {
                    expect(isOk(service.addProductTocart(subscriber.getUserId(), store1.value.getStoreId() , 1 , 10))).to.equal(false);                    
                }
            }

        }
        
    }) 


});