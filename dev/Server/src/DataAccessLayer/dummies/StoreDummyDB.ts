import { makeFailure, makeOk, Result } from "../../Result";
import { Logger } from "../../Logger";
import { Store } from "../../DomainLayer/store/Store";
import { StoreProductInfo } from "../../DomainLayer/store/StoreInfo";
import { iStoreDB } from "../interfaces/iStoreDB";

export class StoreDummyDB implements iStoreDB
{

    private  stores: Store[]  = [];

    public addStore(store: Store): Promise<number>
    {
        this.stores.push(store);
        return Promise.resolve(this.stores.length)
    }

    public  getStoreByID(storeId: number): Promise<Store>
    {
        let store: Store =  this.stores.find(store => store.getStoreId() == storeId);
        if (store)
            return Promise.resolve(store)
        return Promise.reject("store doesnt exist")
    }

    public  deleteStore(storeId: number): Promise<void>
    {
        this.stores = this.stores.filter(store => store.getStoreId() !== storeId);
        return Promise.resolve()
    }

    public  getStoreByName(storeName: string): Promise<Store>
    {
        //TODO: ask real data base
        let store = this.stores.find(store => store.getStoreName() == storeName);
        if (store)
            return Promise.resolve(store)
        return Promise.reject("store doesnt exist")
    }

    public  getPruductInfoByName(productName: string): Promise<string>{
        var products : any = {}
        products['products']=[]
        this.stores.forEach((store) => {
            let storeProductp: Promise<StoreProductInfo> = store.searchByName(productName);
            return new Promise((resolve, reject) => {
                storeProductp.then(storeProduct => {
                    products['products'].push({ 'productName':storeProduct.getName() ,
                    'numberOfRaters':storeProduct.getNumOfRaters(),
                    'rating':storeProduct.getProductRating(),
                    'price': storeProduct.getPrice(),
                    'storeName': store.getStoreName(),
                    'storeId': store.getStoreId(),
                    'productId': storeProduct.getProductId(),
                })
                Logger.log(`Getting products by name answer: ${JSON.stringify(products)}`)
                return Promise.resolve(JSON.stringify(products))
                })
            })
            
        })
        return Promise.all(products['products']).then( _ => {
            let jsonProducts = JSON.stringify(products)
            Logger.log(`Getting products by name answer: ${JSON.stringify(jsonProducts)}`)
            return jsonProducts
        }).catch( error => Promise.reject(error))

    }

    public  getPruductInfoByCategory(category: string): Promise<string>{
        var products : any = {}
        products['products']=[]
        this.stores.forEach((store) => {
            let storeProductp: Promise<StoreProductInfo[]> = store.searchByCategory(category);
            
            return new Promise((resolve, reject) => {
                storeProductp.then(storeProducts => {
                    for(let storeProduct of storeProducts){
                            products['products'].push({ 'productName':storeProduct.getName() ,
                            'numberOfRaters':storeProduct.getNumOfRaters(),
                            'rating':storeProduct.getProductRating(),
                            'price': storeProduct.getPrice(),
                            'storeName': store.getStoreName(),
                            'storeId': store.getStoreId(),
                            'productId': storeProduct.getProductId(),
                            })
                        }}
                        ).catch(err => reject(err))
                    return Promise.resolve(JSON.stringify(products))
                })

            })
        return Promise.all(products['products']).then( _ => {
            let jsonProducts = JSON.stringify(products)
            Logger.log(`Getting products by category answer: ${JSON.stringify(jsonProducts)}`)
            return jsonProducts
        }).catch( error => Promise.reject(error))
    }

    public  getProductInfoAbovePrice(price: number): Promise<string>{
        var products : any = {}
        products['products']=[]
        this.stores.forEach((store) => {
            let storeProductp: Promise<StoreProductInfo[]> = store.searchAbovePrice(price);
            
            return new Promise((resolve, reject) => {
                storeProductp.then(storeProducts => {
                    for(let storeProduct of storeProducts){
                            products['products'].push({ 'productName':storeProduct.getName() ,
                            'numberOfRaters':storeProduct.getNumOfRaters(),
                            'rating':storeProduct.getProductRating(),
                            'price': storeProduct.getPrice(),
                            'storeName': store.getStoreName(),
                            'storeId': store.getStoreId(),
                            'productId': storeProduct.getProductId(),
                            })
                        }}
                        ).catch(err => reject(err))
                    return Promise.resolve(JSON.stringify(products))
                })

            })
        return Promise.all(products['products']).then( _ => {
            let jsonProducts = JSON.stringify(products)
            Logger.log(`Getting products by category answer: ${JSON.stringify(jsonProducts)}`)
            return jsonProducts
        }).catch( error => Promise.reject(error))
    }

    public  getProductInfoBelowPrice(price: number): Promise<string>{
        var products : any = {}
        products['products']=[]
        this.stores.forEach((store) => {
            let storeProductp: Promise<StoreProductInfo[]> = store.searchBelowPrice(price);
            
            return new Promise((resolve, reject) => {
                storeProductp.then(storeProducts => {
                    for(let storeProduct of storeProducts){
                            products['products'].push({ 'productName':storeProduct.getName() ,
                            'numberOfRaters':storeProduct.getNumOfRaters(),
                            'rating':storeProduct.getProductRating(),
                            'price': storeProduct.getPrice(),
                            'storeName': store.getStoreName(),
                            'storeId': store.getStoreId(),
                            'productId': storeProduct.getProductId(),
                            })
                        }}
                        ).catch(err => reject(err))
                    return Promise.resolve(JSON.stringify(products))
                })

            })
        return Promise.all(products['products']).then( _ => {
            let jsonProducts = JSON.stringify(products)
            Logger.log(`Getting products by category answer: ${JSON.stringify(jsonProducts)}`)
            return jsonProducts
        }).catch( error => Promise.reject(error))
    }

    public  getPruductInfoByStore(storeName: string): Promise<string>{
        var products : any = {}
        products['products']=[]
        this.stores.forEach((store) => {
            let storeProductp: Promise<StoreProductInfo[]> = store.getStoreName() === storeName ? store.getProductsInfo() : Promise.resolve([]);
            return new Promise((resolve, reject) => {
                storeProductp.then(storeProducts => {
                    for(let storeProduct of storeProducts){
                            products['products'].push({ 'productName':storeProduct.getName() ,
                            'numberOfRaters':storeProduct.getNumOfRaters(),
                            'rating':storeProduct.getProductRating(),
                            'price': storeProduct.getPrice(),
                            'storeName': store.getStoreName(),
                            'storeId': store.getStoreId(),
                            'productId': storeProduct.getProductId(),
                            })
                        }}
                        ).catch(err => reject(err))
                    return Promise.resolve(JSON.stringify(products))
                })

            })
            return Promise.all(products['products']).then( _ => {
                let jsonProducts = JSON.stringify(products)
                Logger.log(`Getting products by store answer: ${JSON.stringify(products)}`)
                return jsonProducts
            }).catch( error => Promise.reject(error))
    }
    //------------------------------------------functions for tests-------------------------

    public  clear()
    {
        this.stores = [];
    }

}

