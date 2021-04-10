import { Store } from "../store/Store";
export type Pair<T,K> = [T,K];

export class ShoppingBasket
{


    private store : Store ;
    private products: Pair<number,number>[];    //key: productId, value: quantity

    public constructor(storeid:number)
    {

        //TODO: access store database and get the store that have this id
    
    }

    getStoreId(): number
    {
        return this.store.getStoreId();
    }

    getProducts(): Pair<number,number>[]
    {
        return this.products;
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