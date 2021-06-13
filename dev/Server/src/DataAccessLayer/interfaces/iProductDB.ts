import { StoreProduct } from "../../DomainLayer/store/StoreProduct";

export interface iProductDB
{
    getLastProductId: () => Promise<number>;
    
    addProduct: (product: StoreProduct) => Promise<void>;
    
    getAllProductsOfStore: (storeId: number) => Promise<StoreProduct[]>;

    getProductById:(productId: number) =>Promise<StoreProduct>;

    clear:() => void;

    willFail: () => void; 
    willSucceed: () => void; 
}