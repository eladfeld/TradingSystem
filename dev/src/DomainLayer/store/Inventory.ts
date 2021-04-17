import { StoreProduct } from "./StoreProduct";
import { Logger } from "../Logger";
import { isFailure, isOk, makeFailure, makeOk, Result } from "../../Result";
import { ProductDB } from "./ProductDB";
import { Product } from "./Product";
import { StoreProductInfo } from "./StoreInfo";
import { Category } from "./Common";

export class Inventory
{

    private products: Map<number, StoreProduct> // map productId to StoreProduct

    public constructor(){
        this.products = new Map<number, StoreProduct>();
    }

    public addNewProduct(productName: string, categories: Category[], storeId: number, price: number, quantity = 0) : Result<number> {
        if (quantity < 0){
            Logger.error("Quantity must be non negative")
            return makeFailure("Quantity must be non negative");
        }

        if (price < 0){
            Logger.error("Price must be non negative")
            return makeFailure("Price must be non negative");
        }

        if(isOk(this.hasProductWithName(productName))){
            Logger.error("Product already exist in inventory!")
            return makeFailure(`Product already exist in inventory! productName: ${productName}`);
        }
        let product = ProductDB.getProductByName(productName)
        if(product === undefined){
            let product = new Product(productName, categories)
        }
        let productId = ProductDB.getProductByName(productName).getProductId()
        let storeProduct = new StoreProduct(productId,productName,price, storeId,quantity, categories);
        this.products.set(storeProduct.getProductId(), storeProduct);
        Logger.log(`Product was added ProductId: ${productId}, ProductName: ${productName}, StoreId: ${storeId}`)
        return makeOk(productId);
    }

    public addProductQuantity(productId: number, quantity: number) : Result<string> {
        let product = this.products.get(productId);
        if(product === undefined){
            Logger.error("Product does not exist in inventory!")
            return makeFailure("Product does not exist in inventory!");
        }
        product.addQuantity(quantity);
        return makeOk("Quantity was added");
    }

    public setProductQuantity(productId: number, quantity: number) : Result<string> {
        let product = this.products.get(productId);
        if(product === undefined){
            Logger.error("Product does not exist in inventory!")
            return makeFailure("Product does not exist in inventory!");
        }
        product.setQuantity(quantity);
        return makeOk("Quantity was set");
    }

    public isProductAvailable(productId: number, quantity: number) : boolean {
        let product = this.products.get(productId);
        if(product === undefined){
            Logger.error("Product does not exist in inventory!")
            return false;
        }
        if(product.getQuantity() >= quantity){
            return true
        }
        return false
    }

    public hasProductWithName(productName: string) : Result<true> {
        for(let product of this.products.values()){
            if(product.getName() === productName){
                return makeOk(true);
            }
        }
        return makeFailure("Doesn't have product with name");
    }

    public reserveProduct(productId: number, quantity: number): Result<boolean> {
        if(!this.isProductAvailable(productId, quantity)){
            return makeFailure("Product unavailable");
        }
        let product = this.products.get(productId);
        product.setQuantity(product.getQuantity() - quantity);
        Logger.log(`Product reserved Product name: ${product.getName}, Quantity reserved: ${quantity}`);
        return makeOk(true);
    }

    public returnReservedProduct(productId: number, quantity: number): Result<string> {
        if(!this.products.has(productId)){
            return makeFailure("No product with id" + ` ${productId}`+ " found");
        }
        let product = this.products.get(productId);
        product.addQuantity(quantity);
        Logger.log(`Product returned Product name: ${product.getName}, Quantity returned: ${quantity}`);
        return makeOk('Product returned');
    }

    public getProductsInfo(): StoreProductInfo[] {
        let storeProducts: StoreProductInfo[] = []
        for(let storeProduct of this.products.values()){
            storeProducts.push(new StoreProductInfo(storeProduct.getName(), storeProduct.getProductId(), storeProduct.getPrice(), storeProduct.getStoreId(), storeProduct.getProductRating(), storeProduct.getNumOfRaters()))
        }
        return storeProducts
    }

    public getProductInfoByName(productName:string): StoreProductInfo[]{
        let storeProducts: StoreProductInfo[] = [];
        for(let storeProduct of this.products.values()){
            if(storeProduct.getName().includes(productName)){
                storeProducts.push(new StoreProductInfo(storeProduct.getName(), storeProduct.getProductId(), storeProduct.getPrice(), storeProduct.getStoreId(), storeProduct.getProductRating(), storeProduct.getNumOfRaters()));

            }
        }
        return storeProducts;
    }

    public getProductInfoByCategory(category: Category): StoreProductInfo[]{
        let storeProducts: StoreProductInfo[] = [];
        for(let storeProduct of this.products.values()){
            if(storeProduct.getCategories().find(productCategory=>category===productCategory)!= undefined){
                storeProducts.push(new StoreProductInfo(storeProduct.getName(), storeProduct.getProductId(), storeProduct.getPrice(), storeProduct.getStoreId(), storeProduct.getProductRating(), storeProduct.getNumOfRaters()));
            }
        }
        return storeProducts;
    }

    public getProductPrice(productId: number): number{
        let product = this.products.get(productId)
        if(product === undefined){
            return -1;
        }
        return product.getPrice()
    }
}