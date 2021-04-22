import {assert, expect} from 'chai';
import { servicesVersion } from 'typescript';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import Purchase from '../../src/DomainLayer/purchase/Purchase';
import Transaction from '../../src/DomainLayer/purchase/Transaction';
import { Category } from '../../src/DomainLayer/store/Common';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';

describe('2.6: find product' , function() {

        it('find product by name' , function() {
            Authentication.clean();
            let service: Service = Service.get_instance();
            service.clear();
            let guestId1 = service.enter();
            service.register("avi" , "1234");
            if(isOk(guestId1))
            {
                
                let avi = service.login(guestId1.value, "avi", "1234");
                if (isOk(avi))
                {
                    let store = service.openStore(avi.value.getUserId(),"Mega" ,123456 , "Tel aviv");
                    if (isOk(store))
                    {
                        let banana = service.addNewProduct(avi.value.getUserId(), store.value.getStoreId(), "banana" , [Category.ELECTRIC],156,50);
                        let apple = service.addNewProduct(avi.value.getUserId(), store.value.getStoreId(), "apple" , [Category.ELECTRIC],1,10);
                        let products: Result<string> = service.getPruductInfoByName(avi.value.getUserId(), "banana")
                        if(isOk(products))
                        {
                            expect(JSON.parse(products.value)['products'].length).to.equal(1);
                        }
                    }
                    else assert.fail();
                }
                else assert.fail();
            }
            else assert.fail();
            
        })

        it('find product by category' , function() {
            Authentication.clean();
            let service: Service = Service.get_instance();
            service.clear();
            let guestId1 = service.enter();
            service.register("avi" , "1234");
            if(isOk(guestId1))
            {
                
                let avi = service.login(guestId1.value, "avi", "1234");
                if (isOk(avi))
                {
                    let store = service.openStore(avi.value.getUserId(),"Mega" ,123456 , "Tel aviv");
                    if (isOk(store))
                    {
                        let banana = service.addNewProduct(avi.value.getUserId(), store.value.getStoreId(), "banana" , [Category.SWEET],156,50);
                        let apple = service.addNewProduct(avi.value.getUserId(), store.value.getStoreId(), "apple" , [Category.SWEET],1,10);
                        let ball = service.addNewProduct(avi.value.getUserId(), store.value.getStoreId(), "ball" , [Category.SPORT],3,44);
                        let pc = service.addNewProduct(avi.value.getUserId(), store.value.getStoreId(), "pc" , [Category.ELECTRIC],2442,123);
                        let products: Result<string> = service.getPruductInfoByCategory(avi.value.getUserId(), Category.SWEET);
                        if(isOk(products))
                        {
                            expect(JSON.parse(products.value)['products'].length).to.equal(2);
                        }
                    }
                    else assert.fail();
                }
                else assert.fail();
            }
            else assert.fail();
            
        })
});