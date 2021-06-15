import { STORE_CACHE_SIZE } from "../../../config";
import iDiscount from "../../DomainLayer/discount/iDiscount";
import { Rule } from "../../DomainLayer/policy/buying/BuyingPolicy";
import { Store } from "../../DomainLayer/store/Store";
import { storeDB } from "../dbs/StoreDB";
import { iStoreDB } from "../interfaces/iStoreDB";


export class StoreCache implements iStoreDB
{


    private stores: Map<number, [boolean, Store]>
    private storeDb: iStoreDB;
    public constructor()
    {
        this.stores = new Map();
        this.storeDb = new storeDB
    }
    
    willFail: () => void;
    willSucceed: () => void;

    private getStore(storeId: number): Promise<Store>
    {
        if(this.stores.has(storeId))
        {
            if(!this.stores.get(storeId)[0])
                return Promise.resolve(this.stores.get(storeId)[1]);
        }
        let storePromise = this.storeDb.getStoreByID(storeId);
        return new Promise((resolve, reject) =>
        {
            storePromise
            .then(store => 
                {
                    this.cacheStore(store);
                    resolve(store);
                })
            .catch(e => reject(e))
        })
    }

    private cacheStore(store: Store)
    {
        if(this.stores.size >= STORE_CACHE_SIZE)
        {
            this.stores.delete(this.stores.keys().next().value)
        }
        this.stores.set(store.getStoreId(), [false, store]);
    }

    private StoreUpdateCache(storeId: number): void 
    {
        if(this.stores.has(storeId))
        {
            this.stores.get(storeId)[0] = true;
        }
    }

    public addStore(store: Store): Promise<void>{
        this.cacheStore(store);
        return this.storeDb.addStore(store);
    }
    public getLastStoreId():Promise<number>
    {
        return this.storeDb.getLastStoreId();
    }
    public getLastDiscountId():Promise<number>
    {
        return this.storeDb.getLastDiscountId();
    }
    public getLastBuyingId(): Promise<number>
    {
        return this.storeDb.getLastBuyingId();
    }
    public getStoreByID(storeId: number): Promise<Store>
    {
        return this.getStore(storeId);
    }
    public deleteStore(storeId: number) :Promise<void>
    {
        this.stores.delete(storeId);
        return this.storeDb.deleteStore(storeId);
    }
    public getStoreByName(storeName: string): Promise<Store>
    {
        for(let [dirty,store] of this.stores.values())
        {
            if(store.getStoreName() === storeName)
            {
                if(!dirty)
                {
                    return Promise.resolve(store);
                }
                else return this.storeDb.getStoreByID(store.getStoreId());
            }
        }
        return this.storeDb.getStoreByName(storeName);
    }

    public getPruductInfoByName(productName: string): Promise<string>
    {
        return this.storeDb.getPruductInfoByName(productName);
    }
    public getPruductInfoByCategory(category: string): Promise<string>
    {
        return this.storeDb.getPruductInfoByCategory(category);
    }
    public getProductInfoAbovePrice(price: number): Promise<string>
    {   
        return this.storeDb.getProductInfoAbovePrice(price);
    }
    public getProductInfoBelowPrice(price: number): Promise<string>
    {
        return this.storeDb.getProductInfoBelowPrice(price);
    }
    public getPruductInfoByStore(storeName: string):Promise<string>
    {
        return this.storeDb.getPruductInfoByStore(storeName);

    }
    public addCategory(storeId: number, category: string, father: string):Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            let addCategoryPromise = this.storeDb.addCategory(storeId, category, father)
            .then(() =>
            {
                this.StoreUpdateCache(storeId)
                resolve()
            })
            .catch(err => reject(err))
        })
    }
    public getCategoriesOfProduct(productId: number):Promise<string[]>
    {
        return this.storeDb.getCategoriesOfProduct(productId);
    }
    public addCategoriesOfProduct(productId: number, category: string, storeId: number): Promise<void>
    {
        return this.storeDb.addCategoriesOfProduct(productId, category, storeId);
    }
    public addPolicy(storeId: number, rule: Rule): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            let addPolicyPromise = this.storeDb.addPolicy(storeId, rule)
            .then(() =>
            {
                this.StoreUpdateCache(storeId);
                resolve()
            })
            .catch(error => reject(error))
        })
    }
    public addDiscountPolicy(id: number, discount: iDiscount, storeId: number):Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            let addDiscountPromise = this.storeDb.addDiscountPolicy(id, discount, storeId)
            .then(() =>
            {
                this.StoreUpdateCache(storeId);
                resolve()
            })
            .catch(error => reject(error))
        })
    }
    public clear() :void
    {
        for(let id of this.stores.keys())
        {
            this.stores.delete(id);
        }
        this.storeDb.clear()
    }
    
}