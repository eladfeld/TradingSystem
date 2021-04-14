import { makeFailure, Result } from "../../Result";
import { Logger } from "../Logger";
import { ShoppingBasket } from "./ShoppingBasket";
import { PaymentMeans, SupplyInfo } from "./User";

export class ShoppingCart
{
    private baskets : any; // {} <storeId, ShoppingBasket>

    public constructor()
    {
        this.baskets = {};
    }
    
    public buyBasket(storeId : number, paymentMeans: PaymentMeans, supplyInfo: SupplyInfo) : Result<string>
    {
        let basket : ShoppingBasket = this.baskets[storeId];
        if (basket === undefined)
        {
            Logger.error("no such shopping basket");
            return makeFailure("no such shopping basket");
        }
        return basket.buyAll(paymentMeans, supplyInfo);
    }
    public addProduct(storeId:number, productId:number, quantity:number) : Result<string>
    {
        let basket: ShoppingBasket = this.baskets[storeId];
        if(basket === undefined) 
        {
            //TODO: if (shop exist)
            //{
                basket = new ShoppingBasket(storeId);   
                this.baskets[storeId]= basket;
            //}
            //else {
                //Logger.error("shop with id ${storeId} does not exist");
                //return -1 (shop doesnt exist);
            //}
        }
        return basket.addProduct(productId, quantity);
    }

    editStoreCart(storeId : number , productId:number , newQuantity:number) : Result<string>
    {
        let basket: ShoppingBasket = this.baskets[storeId];
        if (basket === undefined)
            return makeFailure("shopping basket doesnt exist");
        return basket.edit(productId,newQuantity);
    }

    getShoppingBasket(storeId: number): {}
    {
        return this.baskets[storeId].getProducts();
    }

}