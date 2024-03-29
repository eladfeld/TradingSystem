import { Logger } from "../../Logger";
import { ShoppingBasket } from "./ShoppingBasket";
import iSubject from "../discount/logic/iSubject";
import { tShippingInfo } from "../purchase/Purchase";
import { StoreDB, SubscriberDB } from "../../DataAccessLayer/DBinit";

export class ShoppingCart
{

    private baskets : Map<number , ShoppingBasket>; // {} <storeId, ShoppingBasket>

    public constructor()
    {
        this.baskets = new Map();
    }

 
    public static rebuildShoppingCart(baskets: ShoppingBasket[])
    {
        let cart = new ShoppingCart();
        baskets.map(basket => cart.baskets.set(basket.getStoreId(), basket))
        return cart;
    }

    
    public checkoutBasket(userId: number, user: iSubject, storeId : number, shippingInfo: tShippingInfo, userSubject: iSubject) : Promise<boolean>
    {
        let basket : ShoppingBasket = this.baskets.get(storeId);
        if (basket === undefined)
        {
            Logger.log("no such shopping basket");
            return Promise.reject("no such shopping basket");
        }
        return basket.checkout(userId, user, shippingInfo, userSubject);
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

    deleteShoppingBasket(storeId : number) : void
    {
        this.baskets.delete(storeId);
    }

    getBasketById(storeId: number): {}
    {
        return this.baskets.get(storeId).getProducts();
    }

    getBaskets()
    {
        return this.baskets;
    }

    getShoppingCart() : Promise<string>
    {
        var mycart : any = {};
        mycart['baskets'] = [];
        let basketsPromises: Promise<{}>[] = [];
        this.baskets.forEach(basket => basketsPromises.push(basket.getShoppingBasket()));
        let allBaskets = Promise.all(basketsPromises)
        return new Promise((resolve, reject) => {
            allBaskets.then(baskets => {
                baskets.forEach(basket => mycart['baskets'].push(basket))
                resolve(JSON.stringify(mycart))
            })
            .catch(error => reject(error))
        })
    }

    quantityInBasket = (storeId:number , productId:number ) : number =>
    {
        try{
            return this.baskets.get(storeId).quantity(productId)
        }catch(e){
            return 0;
        }
    }

}