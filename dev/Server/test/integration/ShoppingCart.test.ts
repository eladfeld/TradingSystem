import {expect} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { ShoppingBasket } from '../../src/DomainLayer/user/ShoppingBasket';
import { ShoppingCart } from '../../src/DomainLayer/user/ShoppingCart';
import { isOk } from '../../src/Result';
import { APIsWillSucceed, failIfRejected, failIfResolved, uniqueAlufHasportName } from '../testUtil';
import { StoreStub } from '../unit/user/StoreStub';
import {setReady, waitToRun} from '../testUtil';

describe('shopping cart tests' , function() {
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });
    it("add product to cart", async function(){
        let shoppingCart: ShoppingCart = new ShoppingCart();
        let store : StoreStub = new StoreStub(123,uniqueAlufHasportName() , 123456 , "Tel Aviv");
        await failIfRejected(() => shoppingCart.addProduct(store.getStoreId(),1,2));
    })

    it("add product to cart from non existent store", async function(){
        let shoppingCart: ShoppingCart = new ShoppingCart();
        await failIfResolved(() => shoppingCart.addProduct(123,1,2))
    })

    it("edit product to cart", async function(){
        let shoppingCart: ShoppingCart = new ShoppingCart();
        let store : StoreStub = new StoreStub(123,uniqueAlufHasportName() , 123456 , "Tel Aviv");
        await failIfRejected(() => shoppingCart.addProduct(store.getStoreId(),1,2));
        await failIfRejected(() => shoppingCart.editStoreCart(store.getStoreId(), 1, 1))
    })

    it("edit cart of non existent store", async function(){
        let shoppingCart: ShoppingCart = new ShoppingCart();
        await failIfResolved(() => shoppingCart.addProduct(123,1,2));
    })

    it("check basket after add to cart", async function(){
        let shoppingCart: ShoppingCart = new ShoppingCart();
        let store : StoreStub = new StoreStub(123,uniqueAlufHasportName() , 123456 , "Tel Aviv");
        await failIfRejected(()=> shoppingCart.addProduct(store.getStoreId(),1,2));
        let storebasket : any= shoppingCart.getBasketById(store.getStoreId());
        expect(storebasket.get(1)).to.equal(2);
    })

})
    