import { Product } from "../../DomainLayer/store/Product";
import { iProductDB } from "../interfaces/iProductDB";


class ProductDB implements iProductDB
{
    addProduct: (product: Product) => void;
    addWitheredProduct: (wproduct: Product) => void;
    getProductByName: (productName: string) => Promise<Product>;
    getProductById: (productId: number) => Promise<Product>;
    clear: () => void;
    
}