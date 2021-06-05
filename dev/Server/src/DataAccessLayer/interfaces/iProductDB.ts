import { Product } from "../../DomainLayer/store/Product";

export interface iProductDB
{
    addProduct: (product: Product) => void;

    addWitheredProduct: (wproduct: Product) => void;

    getProductByName:(productName: string) => Promise<Product>;

    getProductById:(productId: number) =>Promise<Product>;

    clear:() => void;
}