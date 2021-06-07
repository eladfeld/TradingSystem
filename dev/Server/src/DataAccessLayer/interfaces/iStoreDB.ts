import { Store } from "../../DomainLayer/store/Store";

export interface iStoreDB
{
    addStore:(store: Store)=> Promise<void>;
    
    getStoreByID:(storeId: number)=> Promise<Store>;

    deleteStore:(storeId: number) => Promise<void>;

    getStoreByName:(storeName: string) => Promise<Store>;

    getPruductInfoByName:(productName: string) => Promise<string>;

    getPruductInfoByCategory:(category: string) => Promise<string>;

    getProductInfoAbovePrice: (price: number) => Promise<string>;

    getProductInfoBelowPrice: (price: number) => Promise<string>;

    getPruductInfoByStore:(storeName: string) => Promise<string>;

    addCategory: (StoreId: number, category: string, father: string) => Promise<void>;

    clear:() => void;

}