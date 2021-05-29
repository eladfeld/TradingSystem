import { makeFailure, Result } from "../../Result";
import { Logger } from "../../Logger";
import { Store } from "../store/Store";
import { StoreDB } from "../store/StoreDB";
import { ShoppingBasket } from "./ShoppingBasket";
import { PaymentMeans, SupplyInfo } from "./User";
import iSubject from "../discount/logic/iSubject";
import { rejects } from "assert";

export class ShoppingCart
{
    private baskets : Map<number , ShoppingBasket>; // {} <storeId, ShoppingBasket>

    public constructor()
    {
        this.baskets = new Map();
    }

    public checkoutBasket(userId: number, user: iSubject, storeId : number, supply_address: string, userSubject: iSubject) : Result<boolean>
    {
        let basket : ShoppingBasket = this.baskets.get(storeId);
        if (basket === undefined)
        {
            Logger.log("no such shopping basket");
            return makeFailure("no such shopping basket");
        }
        return basket.checkout(userId, user, supply_address, userSubject);
    }

    public addProduct(storeId:number, productId:number, quantity:number) : Promise<ShoppingBasket>
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
                return new Promise( (resolve,reject) => reject(`shop with id ${storeId} does not exist`))
            }
        }

        let addp = basket.addProduct(productId, quantity);
        return new Promise( (resolve,reject) => {
            addp.then( _ => {
                resolve(basket)
            })
            .catch( error => {
                reject("error")
            })
        })
    }

    editStoreCart(storeId : number , productId:number , newQuantity:number) : Promise<string>
    {
        let basket: ShoppingBasket = this.baskets.get(storeId);
        if (basket === undefined)
            return Promise.reject("shopping basket doesnt exist");
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
        return mycart;
    }

    quantityInBasket = (storeId:number , productId:number ) : number =>
    {
        return this.baskets.get(storeId).quantity(productId)
    }

}