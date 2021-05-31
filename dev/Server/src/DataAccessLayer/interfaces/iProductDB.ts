import { StoreProduct } from "../../DomainLayer/store/StoreProduct";

export interface iProductDB
{
    getProductByStoreId(storeId: number, productName: string): Promise<StoreProduct>;
    updateProduct: (product: StoreProduct) => void;

    addProduct: (product: StoreProduct) => Promise<number> ;

    getProductQuantity:(productId: number) => Promise<number>;
    
    getProductByName:(productName: string) => Promise<StoreProduct>;

    getProductById:(productId: number) =>Promise<StoreProduct>;

    getAllProductByStoreId: (storeId: number) => Promise<StoreProduct[]>;

    clear:() => void;
}