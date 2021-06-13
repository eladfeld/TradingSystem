import {assert, expect} from 'chai';
import { Store } from '../../../src/DomainLayer/store/Store';
import { ShoppingBasket } from '../../../src/DomainLayer/user/ShoppingBasket';
import { ShoppingCart } from '../../../src/DomainLayer/user/ShoppingCart';
import { Subscriber } from '../../../src/DomainLayer/user/Subscriber';
import { isOk } from '../../../src/Result';
import { APIsWillSucceed, HASHED_PASSWORD } from '../../testUtil';
import { StoreStub } from './StoreStub';
import {setReady, waitToRun} from '../../testUtil';
import { StoreProduct } from '../../../src/DomainLayer/store/StoreProduct';

describe('view shopping cart' , function() {
    beforeEach( () => {
        //console.log('start')
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        //console.log('finish');        
        setReady(true);
    });
    it("view shopping cart", async function(){
        try{
            let subscriber: Subscriber = new Subscriber("micha",HASHED_PASSWORD, 13);
            let store = new StoreStub(subscriber.getUserId(),"Aluf hasport" , 123456, "Tel Aviv");
            await store.addCategoryToRoot('Sweet')
            let product1: StoreProduct = new StoreProduct("glida",10,store.getStoreId(),10, ['Sweet'],"");
            let product2: StoreProduct = new StoreProduct("glida2",10,store.getStoreId(),10, ['Sweet'],"");
            await subscriber.addProductToShoppingCart(store.getStoreId(),product1.getProductId() , 5);
            await subscriber.addProductToShoppingCart(store.getStoreId(),product2.getProductId() , 5);
            let shopping_cart = await subscriber.GetShoppingCart();
            //if (isOk(shopping_cart))      
            let cart = JSON.parse(shopping_cart)
            expect(cart['baskets'][0]['products'].length).to.equal(2);  
        }
        catch(e) {
            console.log(e)
            assert.fail("exception")
        }
        return Promise.resolve()
    })
});