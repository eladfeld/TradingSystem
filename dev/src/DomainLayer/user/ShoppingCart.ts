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
        if(basket === undefined) 
        {
            //TODO: if (shop exist)
            //{
                basket = new ShoppingBasket(storeId);   
                this.baskets.set(storeId, basket);
            //}
            //else {
                //Logger.error("shop with id ${storeId} does not exist");
                //return -1 (shop doesnt exist);
            //}
        }
        return basket.addProduct(productId, quantity);
    }

    editStoreCart(storeId : number , productId:number , newQuantity:number) : number
    {
        var basket: ShoppingBasket = this.baskets.get(storeId);
        if (basket === undefined)
            return -1;
        return basket.edit(productId,newQuantity);
    }

    getShoppingCart() : number[]
    {
        return Array.from(this.baskets.keys());
    }

    getShoppingBasket(storeId: number): Map<number,number>
    {
        return this.baskets.get(storeId).getProducts();
    }

}