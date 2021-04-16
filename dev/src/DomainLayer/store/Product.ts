import { ID } from "./Common";
import { ProductDB } from "./ProductDB";

export class Product
{

    private productId: number;
    private name: string;
    private storeId: number;
    private price: number;
    private quantity: number;

    public constructor(name: string)
    {
        this.productId = ID();
        this.name = name;
        ProductDB.addProduct(this)
    }

    public getProductId()
    {
        return this.productId;
    }

    public getName()
    {
        return this.name;
    }

    public getStoreId()
    {
        return this.storeId;
    }

    public getPrice()
    {
        return this.price;
    }
    public getQuantity()
    {
        return this.quantity;
    }
}