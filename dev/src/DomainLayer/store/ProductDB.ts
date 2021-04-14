import { Product } from "./Product";
import { WitheredProduct } from "./WitheredProduct";

export class ProductDB
{

    private static withered_products: WitheredProduct[]  = [];

    public static addProduct(product: Product): void
    {
        this.withered_products.push(new WitheredProduct(product.getProductId(),
        product.getName(),
        product.getPrice(),
        product.getStoreId(),
        product.getQuantity()));
    }

    public static addWitheredProduct(wproduct: WitheredProduct): void
    {
        this.withered_products.push(wproduct);
    }

    public static getStoreByID(productId: number): void
    {

        this.withered_products.find(wproduct => wproduct.getStoreId() == productId);
    }

}