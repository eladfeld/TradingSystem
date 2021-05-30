import {expect} from 'chai';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isOk, Result } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service';
import { register_login, open_store } from './common';

describe('2.8: Shopping Cart view and edit' , function() {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
    });

    it('shopping cart before and after delete' , async function()
    {
        let sessionId = await service.enter()
        let avi = await register_login(service,sessionId,"avi", "123456789");
        let store1 = await open_store(service,sessionId,avi,"Aluf Hasport" , 123456 , "Tel Aviv" );
        store1.addCategoryToRoot('Sweet')
        store1.addCategoryToRoot('Computer')
        let product1: Product = new Product("banana", ['Sweet']);
        store1.addNewProduct(avi,product1.getName(),['Computer'],500,100);
        service.addProductTocart(sessionId, store1.getStoreId() , product1.getProductId() , 10);
        service.getCartInfo(sessionId)
        .then(cart =>{
            service.editCart(sessionId, store1.getStoreId(), product1.getProductId(), 0 );
            service.getCartInfo(sessionId).
            then(cart => {
                let tester: any = JSON.parse(cart);
                expect(tester['baskets'][0]['products'].length).to.equal(0);
            })
            .catch(_ => expect(false).to.eq(true))
        })            
        .catch(_ => expect(false).to.eq(true))

    })
});