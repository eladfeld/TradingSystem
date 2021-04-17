import { makeFailure, makeOk, Result } from "../../Result";
import { Logger } from "../Logger";
import { Category, Rating } from "./Common";

export class StoreProduct
{

    private productId: number;
    private name: string;
    private storeId: number;
    private price: number;
    private quantity: number;
    private productRating: number
    private numOfRaters: number
    private categories: Category[];

    public constructor(productId: number, name: string, price: number, storeId: number, quantity:number, categories: Category[])
    {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.storeId = storeId;
        this.quantity = quantity;
        this.productRating = 0 // getting productRating with numOfRaters = 0 will return NaN
        this.numOfRaters = 0
        this.categories = categories
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

    public getCategories()
    {
        return this.categories;
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

    public addProductRating(rating : number) : Result<string>
    {
        if(!Object.values(Rating).includes(rating)){
            Logger.error("Got invalid rating " + `${rating}`)
            return makeFailure("Got invalid rating")
        }
        this.productRating *= this.numOfRaters
        this.numOfRaters++
        this.productRating += rating
        this.productRating /= this.numOfRaters
        Logger.log(`Rating was added new product rating: ${this.productRating}`)
        return makeOk("Rating was added ")
    }

    public getProductRating() : number
    {
        if(this.numOfRaters > 0){
            return this.productRating
        }
        return NaN
    }

}
