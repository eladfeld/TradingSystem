import { makeFailure, Result } from "../../Result";
import { Logger } from "../Logger";
import { Store } from "../store/Store";
import { StoreDB } from "../store/StoreDB";
import { ShoppingBasket } from "./ShoppingBasket";
import { PaymentMeans, SupplyInfo } from "./User";

export class ShoppingCart
{
    private baskets : Map<number , ShoppingBasket>; // {} <storeId, ShoppingBasket>

    public constructor()
    {
        this.baskets = new Map();
    }
    
    public buyBasket(userId: number ,storeId : number, paymentMeans: PaymentMeans, supplyInfo: SupplyInfo) : Result<string>
    {
        let basket : ShoppingBasket = this.baskets.get(storeId);
        if (basket === undefined)
        {
            Logger.error("no such shopping basket");
            return makeFailure("no such shopping basket");
        }
        return basket.buyAll(userId, paymentMeans, supplyInfo);
    }

    public buyCart(userId : number ,paymentMeans : PaymentMeans , supplyInfo : SupplyInfo) :Result<string>
    {
        Array.from(this.baskets.keys()).forEach(storeId => {
            this.buyBasket(userId, storeId,paymentMeans,supplyInfo);
        });
        return makeFailure("TODO: each basket can fail/succeed seperatley what to do?");
    }

    public addProduct(storeId:number, productId:number, quantity:number) : Result<string>
    {
        let basket: ShoppingBasket = this.baskets.get(storeId);
        if(basket === undefined) 
        {
            let store : Store = StoreDB.getStoreByID(storeId);
            if (store !== undefined)
            {
                basket = new ShoppingBasket(store);   
                this.baskets.set(storeId, basket);
            }
            else {
                Logger.error(`shop with id ${storeId} does not exist`);
                makeFailure(`shop with id ${storeId} does not exist`);
            }
        }
        return basket.addProduct(productId, quantity);
    }

    editStoreCart(storeId : number , productId:number , newQuantity:number) : Result<string>
    {
        let basket: ShoppingBasket = this.baskets.get(storeId);
        if (basket === undefined)
            return makeFailure("shopping basket doesnt exist");
        return basket.edit(productId,newQuantity);
    }

    getShoppingBasket(storeId: number): {}
    {
        return this.baskets.get(storeId).getProducts();
    }

}