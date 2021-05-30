import { makeFailure, Result } from "../../Result";
import { Logger } from "../../Logger";
import { Store } from "../store/Store";
import { StoreDB } from "../store/StoreDB";
import { ShoppingBasket } from "./ShoppingBasket";
import { PaymentMeans, SupplyInfo } from "./User";
import iSubject from "../discount/logic/iSubject";
import { rejects } from "assert";
import subscriberDB from "../../DataAccessLayer/SubscriberDummyDb";

export class ShoppingCart
{
    private baskets : Map<number , ShoppingBasket>; // {} <storeId, ShoppingBasket>

    public constructor()
    {
        this.baskets = new Map();
    }

    public checkoutBasket(userId: number, user: iSubject, storeId : number, supply_address: string, userSubject: iSubject) : Promise<boolean>
    {
        let basket : ShoppingBasket = this.baskets.get(storeId);
        if (basket === undefined)
        {
            Logger.log("no such shopping basket");
            return Promise.reject("no such shopping basket");
        }
        let checkoutp = basket.checkout(userId, user, supply_address, userSubject);
        return new Promise((resolve,reject) => {
            checkoutp.then( isSusccesfull => {
                this.baskets.delete(storeId);
                subscriberDB.deleteBasket(userId,storeId);
                resolve(isSusccesfull)
            })
            .catch( error => reject(error))
        })
    }

    public addProduct(storeId:number, productId:number, quantity:number) : Promise<ShoppingBasket>
    {
        let basket: ShoppingBasket = this.baskets.get(storeId);
        let storep = StoreDB.getStoreByID(storeId);
        return new Promise((resolve,reject) => {
            storep.then (store => {
                if(basket === undefined)
                {
                    if (store !== undefined)
                    {
                        basket = new ShoppingBasket(store);
                        this.baskets.set(storeId, basket);
                    }
                    else
                    {
                        Logger.log(`shop with id ${storeId} does not exist`);
                        reject(`shop with id ${storeId} does not exist`)
                    }
                }
                let addp = basket.addProduct(productId, quantity);
                addp.then( _ => { resolve(basket) })
                .catch( error => { reject("error") })
            })
            .catch( error => reject(error))
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