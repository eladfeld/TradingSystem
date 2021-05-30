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

    public static async getProductByName(productName: string): Promise<Product>
    {
        let product = this.products.find(product => product.getName() == productName);
        if (product)
            return Promise.resolve(product)
        return Promise.reject("product not found1")
    }

    public static async getProductById(productId: number): Promise<Product>
    {
        let product = this.products.find(product => product.getProductId() === productId);
        if (product)
            return Promise.resolve(product)
        return Promise.reject("product not found2")
    }

    public static clear()
    {
        this.products=[]
    }

}