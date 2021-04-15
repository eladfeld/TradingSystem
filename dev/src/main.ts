import { Store } from "./DomainLayer/store/Store";
import { ShoppingBasket } from "./DomainLayer/user/ShoppingBasket";
import { StoreStub } from '../test/user/StoreStub';
import { Product } from "./DomainLayer/store/Product";

let stabStore : Store = new StoreStub(123);
let shoppingBasket : ShoppingBasket = new ShoppingBasket(stabStore);
shoppingBasket.setStore(stabStore);
shoppingBasket.addProduct(1,2);
shoppingBasket.addProduct(2,2);
shoppingBasket.addProduct(3,3);
shoppingBasket.addProduct(4,4);
shoppingBasket.addProduct(5,5);
shoppingBasket.addProduct(6,6);
//console.log(shoppingBasket.getProducts().size);
//let cart: ShoppingCart = new ShoppingCart();
//let product : Product = new Product("ball" , 50 , 123 , 50);
// console.log(JSON.stringify(product));

// console.log(JSON.stringify(shoppingBasket , null ,1));

let array :any = {};
array[1234] = 3;
array["hshs"] = 3; 
delete array["ball"];
console.log(array);

console.log(array["hi"]);