import { makeFailure, makeOk, Result } from "../../Result";
import { Logger } from "../../Logger";
import { Rating } from "./Common"
import { productDB } from "../../DataAccessLayer/DBinit";

export class StoreProduct
{

    private productId: number;
    private name: string;
    private storeId: number;
    private price: number;
    private quantity: number;
    private productRating: number
    private numOfRaters: number
    private categories: string[];

    public constructor(productId: number, name: string, price: number, storeId: number, quantity:number, categories: string[])
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

    public static rebuildStoreProduct(productId: number, name: string, price: number, storeId: number, quantity:number, categories: string[]) {
        return new StoreProduct(productId, name, price, storeId, quantity, categories);
    }

    static createProduct(name: string, price: number, storeId: number, quantity:number, categories: string[]): Promise<StoreProduct> {
        let product = new StoreProduct(0, name, price, storeId, quantity, categories);

        return new Promise( (resolve,reject) => { productDB.addProduct(product).then((id: number) => {
            product.setId(id);
            resolve(product);
        }).catch((error => reject(error)))
        return product;
    })
    }

    private setId(id: number){
        this.productId = id;
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
            Logger.log("Quantity has to be non negative")
            return makeFailure("Quantity has to be non negative");
        }
        this.quantity = quantity;
        return makeOk(`New quantity was set, Product Name: ${this.name}, New Quantity: ${this.quantity}\n`);
    }

    public addQuantity(amount: number): Result<string> {
        if(amount < 0){
            Logger.log("Amount has to be non negative")
            return makeFailure("Amount has to be non negative");
        }
        this.quantity = this.quantity + amount;
        return makeOk(`New quantity was added, Product Name: ${this.name}, New Quantity: ${this.quantity}\n`);
    }

    public addProductRating(rating : number) : Result<string>
    {
        if(!Object.values(Rating).includes(rating)){
            Logger.log("Got invalid rating " + `${rating}`)
            return makeFailure("Got invalid rating")
        }
        this.productRating *= this.numOfRaters
        this.numOfRaters++
        this.productRating += rating
        this.productRating /= this.numOfRaters
        return makeOk("Rating was added ")
    }

    public getProductRating() : number
    {
        if(this.numOfRaters > 0){
            return this.productRating
        }
        return NaN
    }

    public getNumOfRaters() : number
    {
        if(this.numOfRaters > 0){
            return this.numOfRaters
        }
        return NaN
    }

}
