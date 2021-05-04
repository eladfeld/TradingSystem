import {expect} from 'chai';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Login } from '../../src/DomainLayer/user/Login';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isFailure, isOk, Result } from '../../src/Result';
import {SystemFacade} from '../../src/DomainLayer/SystemFacade'
import { Service } from '../../src/ServiceLayer/Service';
import { enter_register_login, open_store } from './common';
import { assert } from 'console';

describe('2.7: add to cart test' , function() {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });
    it('add to cart good' , async function() {
        let avi = await enter_register_login(service,"avi","123456789");
        let store1 =await open_store(service,avi , "Aluf Hasport" , 123456 , "Tel Aviv" );
        store1.addCategoryToRoot('Sweet')
        store1.addCategoryToRoot('Computer')
        let product1: Product = new Product("banana", ['Sweet']);
        store1.addNewProduct(avi,product1.getName(),['Computer'],500,100);
        service.addProductTocart(avi.getUserId(), store1.getStoreId() , product1.getProductId() , 10)
        .then( _ => expect(true).to.eq(true))
        .catch( _ => expect(true).to.eq(false))
    })

    it('add non existent product to cart' , async function() {
        let avi = await enter_register_login(service,"avi","123456789");
        let store1 =await open_store(service,avi , "Aluf Hasport" , 123456 , "Tel Aviv" );
        service.addProductTocart(avi.getUserId(), store1.getStoreId() , 1 , 10)
        .then( _ => expect(true).to.eq(false))
        .catch( _ => expect(true).to.eq(true))
    })


});