import { Store } from "./Store";

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

    }

}