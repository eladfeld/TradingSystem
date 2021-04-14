import { Product } from "./Product";
import { Logger } from "../Logger";
import { makeFailure, makeOk, Result } from "../../Result";

export class Inventory
{

    private products: Map<number, Product>

    public constructor(){
        this.products = new Map<number, Product>();
    }

    public addNewProduct(productName: string, storeId: number, price: number, quantity = 0) : Result<string> {
        if (quantity < 0){
            Logger.error("Quantity must be non negative")
            return makeFailure("Quantity must be non negative");
        }

        if (price < 0){
            Logger.error("Price must be non negative")
            return makeFailure("Price must be non negative");
        }

        if(this.hasProductWithName(productName).tag == "Failure"){
            Logger.error("Product already exist in inventory!")
            return makeFailure("Product already exist in inventory!");
        }

        let product = new Product(productName,storeId,price,quantity);
        this.products.set(product.getProductId(), product);
        return makeOk("Product was added");
    }

    public addProductQuantity(productId: number, quantity: number) : Result<string> {
        let product = this.products.get(productId);
        if(product == null){
            Logger.error("Product does not exist in inventory!")
            return makeFailure("Product does not exist in inventory!");
        }
        product.addQuantity(quantity);
        return makeOk("Quantity was added");
    }

    public setProductQuantity(productId: number, quantity: number) : Result<string> {
        let product = this.products.get(productId);
        if(product==null){
            Logger.error("Product does not exist in inventory!")
            return makeFailure("Product does not exist in inventory!");
        }
        product.setQuantity(quantity);
        return makeOk("Quantity was set");
    }

    public isProductAvailable(productId: number, quantity: number) : Result<string> {
        let product = this.products.get(productId);
        if(product==null){
            Logger.error("Product does not exist in inventory!")
            return makeFailure("Product does not exist in inventory!");
        }
        if(product.getQuantity() >= quantity){
            return makeOk("Product is available")
        }
        return
    }

    public hasProductWithName(productName: string) : Result<string> {
        for(let product of this.products.values()){
            if(product.getName() == productName){
                return makeOk("Has product with name");
            }
        }
        return makeFailure("Doesn't have product with name");
    }



}