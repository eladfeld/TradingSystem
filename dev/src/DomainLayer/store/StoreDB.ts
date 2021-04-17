import { makeFailure, makeOk, Result } from "../../Result";
import { Logger } from "../Logger";
import { Category } from "./Common";
import { Store } from "./Store";
import { StoreProductInfo } from "./StoreInfo";

export class StoreDB
{

    private static stores: Store[]  = [];

    public static addStore(store: Store): void
    {
        this.stores.push(store);
    }

    public static getStoreByID(storeId: number): Store
    {
        return this.stores.find(store => store.getStoreId() == storeId);
    }

    public static deleteStore(storeId: number): void
    {
        this.stores = this.stores.filter(store => store.getStoreId() !== storeId);
    }

    public static getStoreByName(storeName: string): Store
    {
        return this.stores.find(store => store.getStoreName() == storeName);
    }

    public static getPruductInfoByName(productName: string): Result<string>{
        var products : any = {}
        products['products']=[]
        this.stores.forEach((store) => {
            let storeProducts: StoreProductInfo[] = store.searchByName(productName);
            for(let storeProduct of storeProducts){
                products['products'].push({ 'product name':storeProduct.getName() ,
                                            'number of raters':storeProduct.getNumOfRaters(),
                                            'rating':storeProduct.getProductRating(),
                                            'price': storeProduct.getPrice(),
                                            'store name': store.getStoreName(),
                                        })
            }
        })
        return makeOk(JSON.stringify(products))
    }

    public static getPruductInfoByCategory(category: number): Result<string>{
        if(!Object.values(Category).includes(category)){
            Logger.log(`Got invalid category number: ${category}`)
            return makeFailure("Got invalid category")
        }
        var products : any = {}
        products['products']=[]
        this.stores.forEach((store) => {
            let storeProducts: StoreProductInfo[] = store.searchByCategory(category);
            for(let storeProduct of storeProducts){
                products['products'].push({ 'product name':storeProduct.getName() ,
                                            'number of raters':storeProduct.getNumOfRaters(),
                                            'rating':storeProduct.getProductRating(),
                                            'price': storeProduct.getPrice(),
                                            'store name': store.getStoreName(),
                                        })
            }
        })
        return makeOk(JSON.stringify(products))
    }

}