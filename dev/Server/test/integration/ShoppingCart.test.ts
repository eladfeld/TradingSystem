import {expect} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { ShoppingBasket } from '../../src/DomainLayer/user/ShoppingBasket';
import { ShoppingCart } from '../../src/DomainLayer/user/ShoppingCart';
import { isOk } from '../../src/Result';
import { StoreStub } from '../unit/user/StoreStub';

describe('shopping cart tests' , function() {
    it("add product to cart", function(){
        let shoppingCart: ShoppingCart = new ShoppingCart();
        let store : StoreStub = new StoreStub(123,"Aluf Hasport" , 123456 , "Tel Aviv");
        expect(isOk(shoppingCart.addProduct(store.getStoreId(),1,2))).to.equal(true);
    })

    it("add product to cart from non existent store", function(){
        let shoppingCart: ShoppingCart = new ShoppingCart();
        expect(isOk(shoppingCart.addProduct(123,1,2))).to.equal(false);
    })

    it("edit product to cart", function(){
        let shoppingCart: ShoppingCart = new ShoppingCart();
        let store : StoreStub = new StoreStub(123,"Aluf Hasport" , 123456 , "Tel Aviv");
        shoppingCart.addProduct(store.getStoreId(),1,2);
        expect(isOk(shoppingCart.editStoreCart(store.getStoreId(), 1, 1))).to.equal(true);
    })

    it("edit cart of non existent store", function(){
        let shoppingCart: ShoppingCart = new ShoppingCart();
        expect(isOk(shoppingCart.addProduct(123,1,2))).to.equal(false);
    })

    it("check basket after add to cart", function(){
        let shoppingCart: ShoppingCart = new ShoppingCart();
        let store : StoreStub = new StoreStub(123,"Aluf Hasport" , 123456 , "Tel Aviv");
        shoppingCart.addProduct(store.getStoreId(),1,2);
        let storebasket : any= shoppingCart.getBasketById(store.getStoreId());
        expect(storebasket.get(1)).to.equal(2);
    })

})
    