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
import { DBstub } from '../DBstub';
import { set_DB } from '../../../src/DataAccessLayer/DBfacade';

describe('view shopping cart' , function() {
    let stubDB = new DBstub();
    beforeEach( () => {
        return waitToRun(()=>APIsWillSucceed());
    });
    
    afterEach(function () {
        setReady(true);
    });
    it("view shopping cart", async function(){
        try{
            let subscriber: Subscriber = new Subscriber("micha",HASHED_PASSWORD, 13);
            let store = new StoreStub(subscriber.getUserId(),"Aluf hasport" , 123456, "Tel Aviv");
            stubDB.getStoreByID = ((id) => Promise.resolve(store));
            set_DB(stubDB)
            await store.addCategoryToRoot('Sweet')
            let product1: StoreProduct = new StoreProduct("glida",10,store.getStoreId(),10, ['Sweet'],"");
            let product2: StoreProduct = new StoreProduct("glida2",10,store.getStoreId(),10, ['Sweet'],"");
            stubDB.getProductById = (id) => id === product1.getProductId() ? Promise.resolve(product1) : Promise.resolve(product2)
            await subscriber.addProductToShoppingCart(store.getStoreId(),product1.getProductId() , 5);
            await subscriber.addProductToShoppingCart(store.getStoreId(),product2.getProductId() , 5);
            let shopping_cart = await subscriber.GetShoppingCart();   
            let cart = JSON.parse(shopping_cart)
            expect(cart['baskets'][0]['products'].length).to.equal(2);  
        }
        catch(e) {
            assert.fail(e)
        }
        return Promise.resolve()
    })
});