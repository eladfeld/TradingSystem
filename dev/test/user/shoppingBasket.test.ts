import {expect} from 'chai';
import { Store } from '../../src/DomainLayer/store/Store';
import { ShoppingBasket } from '../../src/DomainLayer/user/ShoppingBasket';
import { StoreStub } from './StoreStub';

describe('shopping Basket tests' , function() {
    
    var shoppingBasket : ShoppingBasket = new ShoppingBasket(123);
    var stabStore : Store = new StoreStub(123);
    shoppingBasket.setStore(stabStore);

    describe('add to cart' , function() {
        it('add item to cart' , function(){
            shoppingBasket.clear();
            shoppingBasket.addProduct(1,5);
            expect(shoppingBasket.getProducts().get(1)).to.equal(5);
        })
        it('add non existent item to cart' , function(){
            shoppingBasket.clear();
            expect(shoppingBasket.addProduct(-1,18)).to.equal(-1);
        })

        it('add non exsistent item to cart', function(){
            shoppingBasket.clear();
            shoppingBasket.addProduct(-1,18)
            expect(shoppingBasket.getProducts().get(-1)).to.equal(undefined)
        })

        it('add item item to cart twice' , function(){
            shoppingBasket.clear();
            shoppingBasket.addProduct(1,3);
            shoppingBasket.addProduct(1,5);
            expect(shoppingBasket.getProducts().get(1)).to.equal(8);
        })

        it('add negative quantity to cart' , function(){
            shoppingBasket.clear();
            expect(shoppingBasket.addProduct(5,-3)).to.equal(-1);
        })
        

    });

    describe('edit cart' ,function () {
        
        it('decrease quantity of item' , function(){
            shoppingBasket.clear();
            shoppingBasket.addProduct(1,3);
            shoppingBasket.edit(1,2);
            expect(shoppingBasket.getProducts().get(1)).to.equal(2);
        });

        it('increase quantity of item' , function(){
            shoppingBasket.clear();
            shoppingBasket.addProduct(1,3);
            shoppingBasket.edit(1,5);
            expect(shoppingBasket.getProducts().get(1)).to.equal(5);
        });

        it('edit to negative quantity' , function(){
            shoppingBasket.clear();
            shoppingBasket.addProduct(1,3);
            expect(shoppingBasket.edit(1,-5)).to.equal(-1);
        });

        it('edit to quantity 0' , function(){
            shoppingBasket.clear();
            shoppingBasket.addProduct(1,3);
            shoppingBasket.edit(1,0);
            expect(shoppingBasket.getProducts().get(1)).to.equal(undefined);
        });




    });
    
    
});;

        
        
        