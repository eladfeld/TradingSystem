import { StoreProduct } from "./StoreProduct";
import { Logger } from "../../Logger";
import { isFailure, isOk, makeFailure, makeOk, Result } from "../../Result";
import { ProductDB } from "./ProductDB";
import { Product } from "./Product";
import { StoreProductInfo } from "./StoreInfo";

export class Inventory
{

    private products: Map<number, StoreProduct> // map productId to StoreProduct

    public constructor(){
        this.products = new Map<number, StoreProduct>();
    }

    public addNewProduct(productName: string, categories: string[], storeId: number, price: number, quantity = 0) : Promise<number> {
        if (quantity < 0){
            Logger.log("Quantity must be non negative")
            return Promise.reject("Quantity must be non negative");
        }

        if (price < 0){
            Logger.log("Price must be non negative")
            return Promise.reject("Price must be non negative");
        }

        if(isOk(this.hasProductWithName(productName))){
            Logger.log("Product already exist in inventory!")
            return Promise.reject(`Product already exist in inventory! productName: ${productName}`);
        }
        let productp = ProductDB.getProductByName(productName)
        return new Promise((resolve,reject) => {
            productp.then( product => {
                let productId = product.getProductId()
                let storeProduct = new StoreProduct(productId,productName,price, storeId,quantity, categories);
                this.products.set(storeProduct.getProductId(), storeProduct);
                resolve(productId);
            })
            .catch( _ => {
                let product = new Product(productName, categories)
                let productId = product.getProductId()
                let storeProduct = new StoreProduct(productId,productName,price, storeId,quantity, categories);
                this.products.set(storeProduct.getProductId(), storeProduct);
                resolve(productId);
            })
        })
    }

    public addProductQuantity(productId: number, quantity: number) : Result<string> {
        let product = this.products.get(productId);
        if(product === undefined){
            Logger.log("Product does not exist in inventory!")
            return makeFailure("Product does not exist in inventory!");
        }
        product.addQuantity(quantity);
        return makeOk("Quantity was added");
    }

    public setProductQuantity(productId: number, quantity: number) : Promise<string> {
        let product = this.products.get(productId);
        if(product === undefined){
            Logger.log("Product does not exist in inventory!")
            return Promise.reject("Product does not exist in inventory!");
        }

        //TODO: #saveDB
        product.setQuantity(quantity);
        return Promise.resolve("Quantity was set");
    }

    public getProductQuantity(productId : number) : number {
        return this.products.get(productId).getQuantity();
    }

    public isProductAvailable(productId: number, quantity: number) : boolean {
        //TODO: check synchronization accotding to the internet we don't need to sync in javascript
        let product = this.products.get(productId);
        if(product === undefined){
            Logger.log("Product does not exist in inventory!")
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
        return makeOk(true);
    }

    public returnReservedProduct(productId: number, quantity: number): Result<string> {
        if(!this.products.has(productId)){
            return makeFailure("No product with id" + ` ${productId}`+ " found");
        }
        let product = this.products.get(productId);
        product.addQuantity(quantity);
        return makeOk('Product returned');
    }

    private storeProductToInfo = (sp:StoreProduct):StoreProductInfo => {
        return new StoreProductInfo(
        sp.getName(),
        sp.getProductId(),
        sp.getPrice(),
        sp.getStoreId(),
        sp.getQuantity(),
        sp.getProductRating(),
        sp.getNumOfRaters(),
        sp.getCategories());
    }

    public getProductsInfo(): StoreProductInfo[] {
        let storeProducts: StoreProductInfo[] = []
        for(let storeProduct of this.products.values()){
            storeProducts.push(this.storeProductToInfo(storeProduct));
        }
        return storeProducts
    }

    public getProductInfoByName(productName:string): StoreProductInfo[]{
        let storeProducts: StoreProductInfo[] = [];
        for(let storeProduct of this.products.values()){
            if(storeProduct.getName().includes(productName)){
                storeProducts.push(this.storeProductToInfo(storeProduct));
            }
        }
        return storeProducts;
    }

    public getProductInfoByCategory(category: string): StoreProductInfo[]{
        let storeProducts: StoreProductInfo[] = [];
        for(let storeProduct of this.products.values()){
            if(storeProduct.getCategories().find(productCategory=>category===productCategory)!= undefined){
                storeProducts.push(this.storeProductToInfo(storeProduct));
            }
        }
        return storeProducts;
    }

    public getProductInfoByFilter(filter: (x: StoreProduct) => boolean): StoreProductInfo[]{
        return Array.from(this.products.values()).filter(filter).map(storeProduct => {
            return this.storeProductToInfo(storeProduct);
        });
    }

    public getProductPrice(productId: number): number{
        let product = this.products.get(productId)
        if(product === undefined){
            return -1;
        }
        return product.getPrice()
    }

    public getProductById(productId : number) : StoreProduct
    {
        return this.products.get(productId);
    }
}