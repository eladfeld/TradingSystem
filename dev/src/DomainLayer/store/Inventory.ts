import { StoreProduct } from "./StoreProduct";
import { Logger } from "../Logger";
import { makeFailure, makeOk, Result } from "../../Result";
import { ProductDB } from "./ProductDB";
import { Product } from "./Product";

export class Inventory
{

    private products: Map<number, StoreProduct> // map productId to StoreProduct

    public constructor(){
        this.products = new Map<number, StoreProduct>();
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
        let product = ProductDB.getProductByName(productName)
        if(product == undefined){
            let product = new Product(productName)
        }
        let productId = ProductDB.getProductByName(productName).getProductId()
        let storeProduct = new StoreProduct(productId,productName,storeId,price,quantity);
        this.products.set(storeProduct.getProductId(), storeProduct);
        Logger.log("Product was added " + `ProductId: ${productId}, ProductName: ${productName}, StoreId: ${storeId}`)
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

    public sellProduct(productId: number, quantity: number): Result<string> {
        let result = this.isProductAvailable(productId, quantity);
        if(result.tag == 'Failure'){
            return result;
        }
        let product = this.products.get(productId);
        product.setQuantity(product.getQuantity() - quantity);
        Logger.log("Product sold " + `Product name: ${product.getName}, Quantity sold: ${quantity}`);
        return makeOk('Product sold');
    }

    public returnSoldProduct(productId: number, quantity: number): Result<string> {
        if(!this.products.has(productId)){
            return makeFailure("No product with id" + ` ${productId}`+ " found");
        }
        let product = this.products.get(productId);
        product.addQuantity(quantity);
        Logger.log("Product returned " + `Product name: ${product.getName}, Quantity sold: ${quantity}`);
        return makeOk('Product returned');
    }


}