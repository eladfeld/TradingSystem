import {expect} from 'chai';
import { Product } from '../../../src/DomainLayer/store/Product';
import { Store } from '../../../src/DomainLayer/store/Store';
import { ShoppingBasket } from '../../../src/DomainLayer/user/ShoppingBasket';
import { ShoppingCart } from '../../../src/DomainLayer/user/ShoppingCart';
import { Subscriber } from '../../../src/DomainLayer/user/Subscriber';
import { isOk } from '../../../src/Result';
import { HASHED_PASSWORD } from '../../testUtil';
import { StoreStub } from './StoreStub';

describe('view shopping cart' , function() {
    it("view shopping cart", async function(){
        let subscriber: Subscriber = new Subscriber("micha",HASHED_PASSWORD, 13);
        let store = new StoreStub(subscriber.getUserId(),"Aluf hasport" , 123456, "Tel Aviv");
        await store.addCategoryToRoot('Sweet')
        let product1: Product = new Product("glida", ['Sweet']);
        let product2: Product = new Product("glida2", ['Sweet']);
        await subscriber.addProductToShoppingCart(store.getStoreId(),product1.getProductId() , 5);
        await subscriber.addProductToShoppingCart(store.getStoreId(),product2.getProductId() , 5);
        let shopping_cart = await subscriber.GetShoppingCart();
        //if (isOk(shopping_cart))      
        let cart = JSON.parse(shopping_cart)
        expect(cart['baskets'][0]['products'].length).to.equal(2);  
    })
});