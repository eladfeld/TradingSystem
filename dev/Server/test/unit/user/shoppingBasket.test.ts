import {expect} from 'chai';
import { Store } from '../../../src/DomainLayer/store/Store';
import { ShoppingBasket } from '../../../src/DomainLayer/user/ShoppingBasket';
import { isOk } from '../../../src/Result';
import { failIfResolved } from '../../testUtil';
import { StoreStub } from './StoreStub';

describe('shopping Basket tests' , function() {
    
    let stabStore : Store = new StoreStub(123,"Aluf Hasport" , 123456 , "Tel Aviv");
    let shoppingBasket : ShoppingBasket = new ShoppingBasket(stabStore);
    shoppingBasket.setStore(stabStore);

    describe('add to cart' , function() {
        it('add item to cart' , async function(){
            shoppingBasket.clear();
            await shoppingBasket.addProduct(1,5);
            expect((shoppingBasket.getProducts()).get(1)).to.equal(5);
        })
        it('add non existent item to cart' , async function(){
            shoppingBasket.clear();
            await failIfResolved(() => shoppingBasket.addProduct(-1,18))
        })

        it('add non exsistent item to cart', async function(){
            shoppingBasket.clear();
            await failIfResolved(()=> shoppingBasket.addProduct(-1,18))
            expect((shoppingBasket.getProducts()).get(-1)).to.equal(undefined)
        })

        it('add item item to cart twice' , async function(){
            shoppingBasket.clear();
            await shoppingBasket.addProduct(1,3);
            await shoppingBasket.addProduct(1,5);
            expect((shoppingBasket.getProducts()).get(1)).to.equal(8);
        })

        it('add negative quantity to cart' , async function(){
            shoppingBasket.clear();
            await failIfResolved(() => shoppingBasket.addProduct(5,-3));
        })
        

    });

    describe('edit cart' ,function () {
        
        it('decrease quantity of item' , async function(){
            shoppingBasket.clear();
            await shoppingBasket.addProduct(1,3);
            await shoppingBasket.edit(1,2);
            expect((shoppingBasket.getProducts()).get(1)).to.equal(2);
        });

        it('increase quantity of item' , async function(){
            shoppingBasket.clear();
            await shoppingBasket.addProduct(1,3);
            await shoppingBasket.edit(1,5);
            expect((shoppingBasket.getProducts()).get(1)).to.equal(5);
        });

        it('edit to negative quantity' , async function(){
            shoppingBasket.clear();
            await shoppingBasket.addProduct(1,3);
            await failIfResolved(() => shoppingBasket.edit(1,-5));
        });

        it('edit to quantity 0' , async function(){
            shoppingBasket.clear();
            await shoppingBasket.addProduct(1,3);
            await shoppingBasket.edit(1,0);
            expect((shoppingBasket.getProducts().get(1))).to.equal(undefined);
        });




    });
    
    
});;

        
        
        