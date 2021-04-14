import { Store } from "./DomainLayer/store/Store";
import { ShoppingBasket } from "./DomainLayer/user/ShoppingBasket";
import { StoreStub } from '../test/user/StoreStub';

let shoppingBasket : ShoppingBasket = new ShoppingBasket(123);
let stabStore : Store = new StoreStub(123);
shoppingBasket.setStore(stabStore);
shoppingBasket.addProduct(1,2);
shoppingBasket.addProduct(2,2);
shoppingBasket.addProduct(3,3);
shoppingBasket.addProduct(4,4);
shoppingBasket.addProduct(5,5);
shoppingBasket.addProduct(6,6);

//let cart: ShoppingCart = new ShoppingCart();


console.log(JSON.stringify(shoppingBasket));

