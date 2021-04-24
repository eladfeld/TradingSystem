import {expect} from 'chai';
import { Category } from '../../src/DomainLayer/store/Common';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { Authentication } from '../../src/DomainLayer/user/Authentication';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isOk, Result } from '../../src/Result';
import { Service } from '../../src/ServiceLayer/Service';
import { enter_register_login, open_store } from './common';

describe('2.8: Shopping Cart view and edit' , function() {

    var service: Service = Service.get_instance();
    beforeEach(function () {
    });

    afterEach(function () {
        service.clear();
        Authentication.clean();
    });

    it('shopping cart before and after delete' , function() 
    {
        let avi = enter_register_login(service,"avi", "123456789");
        let store1 = open_store(service,avi,"Aluf Hasport" , 123456 , "Tel Aviv" );
        let product1: Product = new Product("banana", [Category.SWEET]);
        store1.addNewProduct(avi,product1.getName(),[Category.COMPUTER],500,100);
        service.addProductTocart(avi.getUserId(), store1.getStoreId() , product1.getProductId() , 10);
        let cart: Result<string> = service.getCartInfo(avi.getUserId());
        if(isOk(cart))
        {
            service.editCart(avi.getUserId(), store1.getStoreId(), product1.getProductId(), 0 );
            cart = service.getCartInfo(avi.getUserId());
            if(isOk(cart))
            {
                let tester: any = JSON.parse(cart.value);
                expect(tester['baskets'][0]['products'].length).to.equal(0);
            }
        }
    })
}); 