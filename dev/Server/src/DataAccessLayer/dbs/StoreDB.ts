import { Store } from "../../DomainLayer/store/Store";
import { iStoreDB } from "../interfaces/iStoreDB";


class StoreDB implements iStoreDB
{
    addStore: (store: Store) => void;
    getStoreByID: (storeId: number) => Promise<Store>;
    deleteStore: (storeId: number) => void;
    getStoreByName: (storeName: string) => Promise<Store>;
    getPruductInfoByName: (productName: string) => Promise<string>;
    getPruductInfoByCategory: (category: string) => Promise<string>;
    getProductInfoAbovePrice: (price: number) => Promise<string>;
    getProductInfoBelowPrice: (price: number) => Promise<string>;
    getPruductInfoByStore: (storeName: string) => Promise<string>;
    clear: () => void;
    
}