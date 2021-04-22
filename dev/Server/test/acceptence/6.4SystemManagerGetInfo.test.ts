import {assert, expect} from 'chai';
import PaymentInfo from '../../src/DomainLayer/purchase/PaymentInfo';
import { Category } from '../../src/DomainLayer/store/Common';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { isOk } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service';

describe('6.4: System Manager Get Info' , function() {

        it('system manager get store purchase history' , function() {
            Authentication.clean();
            let service : Service = Service.get_instance();
            service.clear();
            let guestId1 = service.enter();
            let guestId2 = service.enter();
            if (isOk(guestId1) && isOk(guestId2))
            {
                service.register("avi","1234");
                let avi = service.login(guestId2.value  , "avi" , "1234");
                let sys_manager = service.login(guestId1.value, "michael","1234");
                if (isOk(sys_manager) && isOk(avi))
                {
                    let store = service.openStore(avi.value.getUserId() , "Aluf hasport" , 123456 , "Tel aviv");
                    if(isOk(store))
                    {
                        let apple = service.addNewProduct(avi.value.getUserId() , store.value.getStoreId() , "apple" , [Category.SWEET] , 10 , 15);
                        if (isOk(apple))
                        {
                            service.checkoutSingleProduct(sys_manager.value.getUserId() , apple.value , 5 , store.value.getStoreId() , "King Goerge street" );
                            service.completeOrder(sys_manager.value.getUserId() , store.value.getStoreId() , new PaymentInfo(1234,456,48948));
                            expect(isOk(service.getStorePurchaseHistory(sys_manager.value.getUserId() , store.value.getStoreId())));
                        }
                        else assert.fail();
                    }
                    else assert.fail();
                }
                else assert.fail();

            }
            else assert.fail();
        })

        it('system manager get user purchase history' , function() {
            Authentication.clean();
            let service : Service = Service.get_instance();
            service.clear();
            let guestId1 = service.enter();
            let guestId2 = service.enter();
            let guestId3 = service.enter();
            if (isOk(guestId1) && isOk(guestId2)  && isOk(guestId3))
            {
                service.register("avi","1234");
                service.register("ali","1234");
                let sys_manager = service.login(guestId1.value, "michael","1234");
                let avi = service.login(guestId2.value  , "avi" , "1234");
                let ali = service.login(guestId3.value  , "ali" , "1234");
                if (isOk(sys_manager) && isOk(avi) && isOk(ali))
                {
                    let store = service.openStore(avi.value.getUserId() , "Aluf hasport" , 123456 , "Tel aviv");
                    if(isOk(store))
                    {
                        let apple = service.addNewProduct(avi.value.getUserId() , store.value.getStoreId() , "apple" , [Category.SWEET] , 10 , 15);
                        if (isOk(apple))
                        {
                            service.checkoutSingleProduct(ali.value.getUserId() , apple.value , 5 , store.value.getStoreId() , "King Goerge street" );
                            service.completeOrder(ali.value.getUserId() , store.value.getStoreId() , new PaymentInfo(1234,456,48948));
                            expect(isOk(service.getSubscriberPurchaseHistory(sys_manager.value.getUserId() , ali.value.getUserId()))).to.equal(true);
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