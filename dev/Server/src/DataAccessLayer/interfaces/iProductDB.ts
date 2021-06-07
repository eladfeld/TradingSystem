import { StoreProduct } from "../../DomainLayer/store/StoreProduct";

export interface iProductDB
{
    addProduct: (product: StoreProduct) => Promise<void>;
    
    getAllProductsOfStore: (storeId: number) => Promise<StoreProduct[]>;

    getProductById:(productId: number) =>Promise<StoreProduct>;

    clear:() => void;
}