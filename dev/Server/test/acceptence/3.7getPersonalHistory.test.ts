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
import {Service} from '../../src/ServiceLayer/Service'

describe('3.7: get subscriber history' , function() {

        it('get personal purchase history' , function() {
            Authentication.clean();
            let service = Service.get_instance();
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
                        let banana = service.addNewProduct(avi.value.getUserId(), store.value.getStoreId(), "banana" , [Category.SWEET],1,50);
                        let apple = service.addNewProduct(avi.value.getUserId(), store.value.getStoreId(), "apple" , [Category.SWEET],1,10);
                        if (isOk(banana) && isOk(apple))
                        {
                            service.addProductTocart(avi.value.getUserId(), store.value.getStoreId() , banana.value ,10 );
                            service.addProductTocart(avi.value.getUserId(), store.value.getStoreId() , apple.value ,7 );
                            service.checkoutBasket(avi.value.getUserId(),store.value.getStoreId(),"king Goerge st 42");
                            service.completeOrder(avi.value.getUserId(), store.value.getStoreId(),new PaymentInfo(1234, 456,2101569));
                            let historyRes: Result<any> = service.getSubscriberPurchaseHistory(avi.value.getUserId(), avi.value.getUserId());
                            if(isOk(historyRes))
                            {
                                let history = JSON.parse(historyRes.value);
                                expect(history.length).to.equal(1);
                            }
                            else assert.fail();
                        }
                    }
                    else assert.fail();
                }
                else assert.fail();
            }
            else assert.fail();
            
        })
});