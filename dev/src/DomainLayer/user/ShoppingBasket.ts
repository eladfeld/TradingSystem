import { makeFailure, makeOk, Result } from "../../Result";
import { Logger } from "../Logger";
import { Purchase } from "../Purchase";
import { Store } from "../store/Store";
import { PaymentMeans, SupplyInfo } from "./User";

export class ShoppingBasket
{
    
    private store : Store ;
    private products: Map<number,number>;    //key: productId, value: quantity

    public constructor(storeid:number)
    {
        this.products = new Map();
        //TODO: access store database and get the store that have this id
    
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
        if (!this.store.openForImmediateBuy(productId))
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
        this.products.set(productId, prevQuantity+quantity);
        return makeOk("product added to cart");
    }
    
    public buyAll(paymentMeans: PaymentMeans,supplyInfo: SupplyInfo): Result<string>
    {
        //TODO: sync with purchase about checkout!
        let price: number = this.store.calculatePrice(this.products);
        return Purchase.checkout(price, this.store, paymentMeans, supplyInfo);
    }

    public edit(productId: number, newQuantity: number): Result<string> 
    {
        if (newQuantity < 0)
            return makeFailure("negative quantity");
        if (!this.store.isProductAvailable(productId,newQuantity))
            return makeFailure("quantity not available");

        this.products.set(productId,newQuantity)
        if (newQuantity === 0)
            this.products.delete(productId);
        return makeOk("added to cart");
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