import { ShoppingBasket } from "./ShoppingBasket";

export class ShoppingCart
{
    private baskets : Map<number,ShoppingBasket>; // <storeId, ShoppingBasket>

    public constructor()
    {
        this.baskets = new Map();
    }

    addProduct(storeId:number, productId:number, quantity:number) : number
    {
        var basket: ShoppingBasket = this.baskets.get(storeId);
        if(basket === null )
        {
            var newBasket: ShoppingBasket = new ShoppingBasket(storeId);
            if(newBasket !== null)
            {
                this.baskets.set(storeId,newBasket);
            }
            else 
            {
                return -1;  //store doesnt exist
            }
        }
        return basket.addProduct(productId, quantity);
    }

}