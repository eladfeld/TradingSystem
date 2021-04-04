import { Store } from "../Store";
import { Product } from "./Product";

export class ShoppingBasket
{


    private store : Store ;
    //private products : {Products, numb[];

    public constructor(storeid:number)
    {

    }

    getStoreId() {
        return this.store.getStoreId();
    }

    addProduct(productId: number, quantity: number): number {
        if(this.store.isProductAvailable(productId, quantity))
        {
            //this.products.push()
        }
        return 0;
    }
}