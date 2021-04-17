import {expect} from 'chai';
import { Product } from '../../src/DomainLayer/store/Product';
import { Store } from '../../src/DomainLayer/store/Store';
import { ShoppingBasket } from '../../src/DomainLayer/user/ShoppingBasket';
import { ShoppingCart } from '../../src/DomainLayer/user/ShoppingCart';
import { Subscriber } from '../../src/DomainLayer/user/Subscriber';
import { isOk } from '../../src/Result';
import { StoreStub } from './StoreStub';

describe('view shopping cart' , function() {
    it("view shopping cart", function(){
        let subscriber: Subscriber = new Subscriber("micha");
        let store = new StoreStub(subscriber.getUserId(),"Aluf hasport" , 123456, "Tel Aviv");
        let product1: Product = new Product("glida", "sweets");
        let product2: Product = new Product("glida2", "sweets");
        subscriber.addProductToShoppingCart(store.getStoreId(),product1.getProductId() , 5);
        subscriber.addProductToShoppingCart(store.getStoreId(),product2.getProductId() , 5);
        console.log(subscriber.GetShoppingCart());
        console.log(product1.getProductId());
        console.log(product2.getProductId())
    })
});