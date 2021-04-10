import { Logger } from "../Logger";
import {ID} from './Common';

export class Product
{

    private productId: number;
    private name: string;
    private storeId: number;
    private price: number;  
    private quantity: number;  

    public constructor(name: string, price: number, storeId: number, quantity:number)
    {
        this.productId = ID();
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

    public setQuantity(quantity: number): boolean{
        if(quantity < 0){
            Logger.error("Quantity has to be non negative")
            return false;            
        }
        this.quantity = quantity;
        Logger.log(`New quantity was set, Product Name: ${this.name}, New Quantity: ${this.quantity}\n`)
        return true;
    }

    public addQuantity(amount:number){
        if(amount < 0){
            Logger.error("Amount has to be non negative")
            return false;             
        }
        this.quantity = this.quantity + amount;
        Logger.log(`New quantity was added, Product Name: ${this.name}, New Quantity: ${this.quantity}\n`)
        return true;
    }
}
