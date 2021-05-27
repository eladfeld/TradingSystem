import { makeFailure, Result } from "../../Result";
import { Logger } from "../../Logger";
import { Store } from "../store/Store";
import { StoreDB } from "../store/StoreDB";
import { ShoppingBasket } from "./ShoppingBasket";
import { PaymentMeans, SupplyInfo } from "./User";
import iSubject from "../discount/logic/iSubject";
import ts from "typescript";
import { tShippingInfo } from "../purchase/Purchase";

export class ShoppingCart
{
    private baskets : Map<number , ShoppingBasket>; // {} <storeId, ShoppingBasket>

    public constructor()
    {
        this.baskets = new Map();
    }

    public checkoutBasket(userId: number, user: iSubject, storeId : number, shippingInfo: tShippingInfo, userSubject: iSubject) : Result<boolean>
    {
        let basket : ShoppingBasket = this.baskets.get(storeId);
        if (basket === undefined)
        {
            Logger.log("no such shopping basket");
            return makeFailure("no such shopping basket");
        }
        return basket.checkout(userId, user, shippingInfo, userSubject);
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
            else
            {
                Logger.log(`shop with id ${storeId} does not exist`);
                return makeFailure(`shop with id ${storeId} does not exist`);
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

    getBasketById(storeId: number): {}
    {
        return this.baskets.get(storeId).getProducts();
    }

    getBaskets()
    {
        return this.baskets;
    }

    getShoppingCart() : {}
    {
        var mycart : any = {};
        mycart['baskets'] = [];
        Array.from(this.baskets.values()).forEach(basket => mycart['baskets'].push(basket.getShoppingBasket()))
        // for (var basket in this.baskets)
        // {
        //     let basket2 = ShoppingBasket(basket);
        //     mycart['baskets'].push(basket.getShoppingBasket())
        // }
        // this.baskets.forEach( (basket,storeId,map) => mycart['baskets'].push(basket.getShoppingBasket()));
        return mycart;
    }

    quantityInBasket = (storeId:number , productId:number ) : number =>
    {
        return this.baskets.get(storeId).quantity(productId)
    }

}