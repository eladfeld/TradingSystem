import { makeFailure, makeOk, Result } from "../../Result";
import { Logger } from "../../Logger";
import { Store } from "./Store";
import { StoreProductInfo } from "./StoreInfo";

export class StoreDB
{

    private static stores: Store[]  = [];

    public static addStore(store: Store): void
    {
        this.stores.push(store);
    }

    public static getStoreByID(storeId: number): Promise<Store>
    {
        let store: Store =  this.stores.find(store => store.getStoreId() == storeId);
        if (store)
            return Promise.resolve(store)
        return Promise.reject("store doesnt exist")
    }

    public static deleteStore(storeId: number): void
    {
        this.stores = this.stores.filter(store => store.getStoreId() !== storeId);
    }

    public static getStoreByName(storeName: string): Promise<Store>
    {
        //TODO: ask real data base
        let store = this.stores.find(store => store.getStoreName() == storeName);
        if (store)
            return Promise.resolve(store)
        return Promise.reject("store doesnt exist")
    }

    public static getPruductInfoByName(productName: string): Result<string>{
        var products : any = {}
        products['products']=[]
        this.stores.forEach((store) => {
            let storeProducts: StoreProductInfo[] = store.searchByName(productName);
            for(let storeProduct of storeProducts){
                products['products'].push({ 'productName':storeProduct.getName() ,
                                            'numberOfRaters':storeProduct.getNumOfRaters(),
                                            'rating':storeProduct.getProductRating(),
                                            'price': storeProduct.getPrice(),
                                            'storeName': store.getStoreName(),
                                            'storeId': store.getStoreId(),
                                            'productId': storeProduct.getProductId(),
                                        })
            }
        })
        Logger.log(`Getting products by name answer: ${JSON.stringify(products)}`)
        return makeOk(JSON.stringify(products))
    }

    public static getPruductInfoByCategory(category: string): Result<string>{
        var products : any = {}
        products['products']=[]
        this.stores.forEach((store) => {
            let storeProducts: StoreProductInfo[] = store.searchByCategory(category);
            for(let storeProduct of storeProducts){
                products['products'].push({ 'productName':storeProduct.getName() ,
                'numberOfRaters':storeProduct.getNumOfRaters(),
                'rating':storeProduct.getProductRating(),
                'price': storeProduct.getPrice(),
                'storeName': store.getStoreName(),
                'storeId': store.getStoreId(),
                'productId': storeProduct.getProductId(),
                                        })
            }
        })
        return makeOk(JSON.stringify(products))
    }

    public static getProductInfoAbovePrice(price: number): Result<string>{
        var products : any = {}
        products['products']=[]
        this.stores.forEach((store) => {
            let storeProducts: StoreProductInfo[] = store.searchAbovePrice(price);
            for(let storeProduct of storeProducts){
                products['products'].push({ 'productName':storeProduct.getName() ,
                'numberOfRaters':storeProduct.getNumOfRaters(),
                'rating':storeProduct.getProductRating(),
                'price': storeProduct.getPrice(),
                'storeName': store.getStoreName(),
                'storeId': store.getStoreId(),
                'productId': storeProduct.getProductId(),
                                        })
            }
        })
        return makeOk(JSON.stringify(products))
    }

    public static getProductInfoBelowPrice(price: number): Result<string>{
        var products : any = {}
        products['products']=[]
        this.stores.forEach((store) => {
            let storeProducts: StoreProductInfo[] = store.searchBelowPrice(price);
            for(let storeProduct of storeProducts){
                products['products'].push({ 'productName':storeProduct.getName() ,
                'numberOfRaters':storeProduct.getNumOfRaters(),
                'rating':storeProduct.getProductRating(),
                'price': storeProduct.getPrice(),
                'storeName': store.getStoreName(),
                'storeId': store.getStoreId(),
                'productId': storeProduct.getProductId(),
                                        })
            }
        })
        return makeOk(JSON.stringify(products))
    }

    public static getPruductInfoByStore(storeName: string): Result<string>{
        var products : any = {}
        products['products']=[]
        this.stores.forEach((store) => {
            let storeProducts: StoreProductInfo[] = store.getStoreName() === storeName ? store.getProductsInfo() : [];
            for(let storeProduct of storeProducts){
                products['products'].push({ 'productName':storeProduct.getName() ,
                'numberOfRaters':storeProduct.getNumOfRaters(),
                'rating':storeProduct.getProductRating(),
                'price': storeProduct.getPrice(),
                'storeName': store.getStoreName(),
                'storeId': store.getStoreId(),
                'productId': storeProduct.getProductId(),
                                        })
            }
        })

        Logger.log(`Getting products by store answer: ${JSON.stringify(products)}`)

        return makeOk(JSON.stringify(products))
    }
    //------------------------------------------functions for tests-------------------------

    public static clear()
    {
        this.stores = [];
    }

}