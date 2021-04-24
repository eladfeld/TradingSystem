import {Assertion, expect , assert} from 'chai';
import { Category } from '../../src/DomainLayer/store/Common';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { enter_login, enter_register_login } from './common';

describe('2.5: store info test' , function() {

    var service : Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function() {
        service.clear();
        Authentication.clean();
    });

    it('store info test good', function () {
        let avi = enter_register_login(service, "avi", "123456789");
        let store1 = service.openStore(avi.getUserId(), "aluf hasport", 123456, "Tel Aviv");
        let store2 = service.openStore(avi.getUserId(), "mega", 123456, "Tel Aviv");
        if (isOk(store1) && isOk(store2)) {
            service.addNewProduct(avi.getUserId(), store1.value.getStoreId(), "Apple", [Category.SHIRT], 26, 10);
            service.addNewProduct(avi.getUserId(), store2.value.getStoreId(), "banana", [Category.SHIRT], 26, 20);
            expect(isOk(service.getStoreInfo(avi.getUserId(), store1.value.getStoreId()))).to.equal(true);
        }
        else assert.fail();
    })

    it('try to watch store without permission', function () {

        let avi: Subscriber = enter_register_login(service, "avi", "123456789");
        let store1: Result<Store> = service.openStore(avi.getUserId(), "aluf hasport", 123456, "Tel Aviv");
        let store2: Result<Store> = service.openStore(avi.getUserId(), "mega", 123456, "Tel Aviv");
        if (isOk(store1) && isOk(store2)) {
            service.addNewProduct(avi.getUserId(), store1.value.getStoreId(), "Apple", [Category.SHIRT], 26, 10);
            service.addNewProduct(avi.getUserId(), store2.value.getStoreId(), "banana", [Category.SHIRT], 26, 20);
            expect(isOk(service.getStoreInfo(avi.getUserId() + 1, store1.value.getStoreId()))).to.equal(false);
        }
        else assert.fail();
    })

    it('avi opens store , system manager watching it' , function() {
        //----------------avi opens store---------------------------------
        let avi = enter_register_login(service,"avi","123456789");
        var store1 = service.openStore(avi.getUserId(), "aluf hasport" , 123456 , "Tel Aviv");
        if (isOk(store1))
        {
            service.addNewProduct(avi.getUserId() , store1.value.getStoreId() , "Apple" , [Category.SHIRT] , 26 , 10);
        }
        //----------------------------------------------------------------


        //-----------------system manager watches-------------------------
        let michael = enter_login(service, "michael", "1234")
        if (isOk(store1))
            expect(isOk(service.getStoreInfo(michael.getUserId(), store1.value.getStoreId()))).to.equal(true);
        else assert.fail();
        //---------------------------------------------------------------
    })    


});