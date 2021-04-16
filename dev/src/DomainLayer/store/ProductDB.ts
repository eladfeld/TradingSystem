import { StoreProduct } from "./StoreProduct";
import { Product } from "./Product";

export class ProductDB
{

    private static products: Product[]  = [];

    public static addProduct(product: Product): void
    {
        this.products.push(product);
    }

    public static addWitheredProduct(wproduct: Product): void
    {
        this.products.push(wproduct);
    }

    public static getProductByStoreID(storeId: number): Product
    {
        return this.products.find(product => product.getStoreId() == storeId);
    }

    public static getProductByName(productName: string): Product
    {
        return this.products.find(product => product.getName() == productName);
    }

}