import iDiscount from "../../DomainLayer/discount/iDiscount";
import { Rule } from "../../DomainLayer/policy/buying/BuyingPolicy";
import { Store } from "../../DomainLayer/store/Store";

export interface iStoreDB
{
    getRecievingOffers: (storeId: number)=> Promise<boolean>

    updateStoreRecievesOffers: (storeId: number, recieveOffers: boolean) => Promise<void>;

    addStore:(store: Store)=> Promise<void>;

    getLastStoreId:() => Promise<number>;

    getLastDiscountId:() => Promise<number>;

    getLastBuyingId:()=> Promise<number>;

    getStoreByID:(storeId: number)=> Promise<Store>;

    deleteStore:(storeId: number) => Promise<void>;

    getStoreByName:(storeName: string) => Promise<Store>;

    getPruductInfoByName:(productName: string) => Promise<string>;

    getPruductInfoByCategory:(category: string) => Promise<string>;

    getProductInfoAbovePrice: (price: number) => Promise<string>;

    getProductInfoBelowPrice: (price: number) => Promise<string>;

    getPruductInfoByStore:(storeName: string) => Promise<string>;

    addCategory: (StoreId: number, category: string, father: string) => Promise<void>;

    getCategoriesOfProduct:(productId: number) => Promise<string[]>

    addCategoriesOfProduct:(productId: number, category: string, storeId: number) => Promise<void>

    addPolicy: (storeId: number, rule: Rule) => Promise<void>;

    addDiscountPolicy: (id: number, discount: iDiscount, storeId: number) => Promise<void>

    clear:() => void;

}