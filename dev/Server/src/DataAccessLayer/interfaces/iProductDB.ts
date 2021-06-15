import { StoreProduct } from "../../DomainLayer/store/StoreProduct";

export interface iProductDB
{
    getLastProductId: () => Promise<number>;

    addProduct: (product: StoreProduct) => Promise<void>;

    getAllProductsOfStore: (storeId: number) => Promise<StoreProduct[]>;

    getProductById:(productId: number) =>Promise<StoreProduct>;

    updateProduct:(product: StoreProduct) =>Promise<void>;

    clear:() => void;

    willFail: () => void; 
    willSucceed: () => void; 
}