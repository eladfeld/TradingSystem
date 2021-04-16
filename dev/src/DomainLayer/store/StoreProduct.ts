import { makeFailure, makeOk, Result } from "../../Result";
import { Logger } from "../Logger";

export class StoreProduct
{

    private productId: number;
    private name: string;
    private storeId: number;
    private price: number;
    private quantity: number;

    public constructor(productId: number, name: string, price: number, storeId: number, quantity:number)
    {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.storeId = storeId;
        this.quantity = quantity;
    }

    public getProductId()
    {
        return this.productId;
    }

    public getName()
    {
        return this.name;
    }

    public getStoreId()
    {
        return this.storeId;
    }

    public getPrice()
    {
        return this.price;
    }
    public getQuantity()
    {
        return this.quantity;
    }

    public setQuantity(quantity: number): Result<string> {
        if(quantity < 0){
            Logger.error("Quantity has to be non negative")
            return makeFailure("Quantity has to be non negative");
        }
        this.quantity = quantity;
        Logger.log(`New quantity was set, Product Name: ${this.name}, New Quantity: ${this.quantity}\n`)
        return makeOk(`New quantity was set, Product Name: ${this.name}, New Quantity: ${this.quantity}\n`);
    }

    public addQuantity(amount: number): Result<string> {
        if(amount < 0){
            Logger.error("Amount has to be non negative")
            return makeFailure("Amount has to be non negative");
        }
        this.quantity = this.quantity + amount;
        Logger.log(`New quantity was added, Product Name: ${this.name}, New Quantity: ${this.quantity}\n`)
        return makeOk(`New quantity was added, Product Name: ${this.name}, New Quantity: ${this.quantity}\n`);
    }
}
