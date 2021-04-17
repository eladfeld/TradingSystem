import { isOk, makeFailure, makeOk, Result } from "../../Result";
import { Logger } from "../Logger";
import { buyingOption } from "../store/BuyingOption";
import { Store } from "../store/Store";
import { PaymentMeans, SupplyInfo } from "./User";

export class ShoppingBasket
{

    private store : Store ;
    private products: any;    //key: productId, value: quantity

    public constructor(store:Store)
    {
        this.products = {};
        this.store = store;
    }

    getStoreId(): number
    {
        return this.store.getStoreId();
    }

    public getProducts(): any
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
        if (this.products[productId] != undefined)
            prevQuantity = this.products[productId];
        this.products[productId] =prevQuantity+quantity;
        return makeOk("product added to cart");
    }

    public buyAll(userId:number, paymentMeans: PaymentMeans,supplyInfo: SupplyInfo): Result<string>
    {
        // return this.store.sellShoppingBasket(userId,SupplyInfo );
        return makeFailure("not yet implemented!")
    }

    public edit(productId: number, newQuantity: number): Result<string>
    {
        if (newQuantity < 0)
            return makeFailure("negative quantity");
        if (!this.store.isProductAvailable(productId,newQuantity))
            return makeFailure("quantity not available");

        this.products[productId]=newQuantity;
        if (newQuantity === 0)
            delete this.products[productId];
        return makeOk("added to cart");
    }

    //------------------------------------functions for tests-------------------------------------

    public clear() : void
    {
        this.products = {};
    }
    public setStore(store:Store) : void
    {
        this.store = store;
    }
}