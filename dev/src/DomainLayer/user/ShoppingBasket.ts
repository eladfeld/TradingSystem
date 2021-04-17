import { isOk, makeFailure, makeOk, Result } from "../../Result";
import { Logger } from "../Logger";
import { buyingOption } from "../store/BuyingOption";
import { Product } from "../store/Product";
import { ProductDB } from "../store/ProductDB";
import { Store } from "../store/Store";
import { PaymentMeans, SupplyInfo } from "./User";

export class ShoppingBasket
{

    private store : Store ;
    private products: Map<number,number>;    //key: productId, value: quantity

    public constructor(store:Store)
    {
        this.products = new Map();
        this.store = store;
    }

    getStoreId(): number
    {
        return this.store.getStoreId();
    }

    public getProducts(): Map<number,number>
    {
        return this.products;
    }

    public addProduct(productId: number, quantity: number): Result<string>
    {
        if (quantity < 0)
        {
            Logger.error("quantity can't be negative number");
            return makeFailure("quantity can't be negative number");
        }
        if(quantity === 0)
        {
            return makeFailure("quantity can't be set to zero");
        }
        if (!this.store.getBuyingPolicy().hasBuyingOption(buyingOption.INSTANT))
        {
            Logger.error("product not for immediate buy");
            return makeFailure("product not for immediate buy");
        }
        if(!this.store.isProductAvailable(productId, quantity))
        {
            Logger.log("product is not available in this quantity");
            return makeFailure("product is not available in this quantity");
        }

        let prevQuantity : number = 0;
        if (this.products.get(productId) != undefined)
            prevQuantity = this.products.get(productId);
        this.products.set(productId,prevQuantity+quantity);
        return makeOk("product added to cart");
    }

    public checkout(userId:number, supply_address: string): Result<boolean>
    {
        return this.store.sellShoppingBasket(userId,supply_address,this);
    }

    public edit(productId: number, newQuantity: number): Result<string>
    {
        if (newQuantity < 0)
            return makeFailure("negative quantity");
        if (!this.store.isProductAvailable(productId,newQuantity))
            return makeFailure("quantity not available");

        this.products.set(productId,newQuantity);
        if (newQuantity === 0)
            this.products.delete(productId);
        return makeOk("added to cart");
    }

    getShoppingBasket() : {}
    {
        var basket : any = {}
        basket['store'] = this.store.getStoreName();
        basket['products']=[]
        this.products.forEach(function(quantity,productId,map){
            let product: Product = ProductDB.getProductById(productId);
            basket['products'].push({'productId':productId , 'name':product.getName(),'quantity':quantity})
        })
        return basket;
    }

    //------------------------------------functions for tests-------------------------------------

    public clear() : void
    {
        this.products = new Map();
    }
    public setStore(store:Store) : void
    {
        this.store = store;
    }
}