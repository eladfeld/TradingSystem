import { Store } from "./Store";
type Pair<T,K> = [T,K];

export class ShoppingBasket
{


    private store : Store ;
    private products: Pair<number,number>[];    //key: productId, value: quantity

    public constructor(storeid:number)
    {
    }

    getStoreId() {
        return this.store.getStoreId();
    }

    addProduct(productId: number, quantity: number): number {
        if(this.store.isProductAvailable(productId, quantity))
        {
            this.products.push([productId, quantity]);
        }
        else
        {
            return -1;
        }
        return 0;
    }
}