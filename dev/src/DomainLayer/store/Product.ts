import { ID } from "./Common";
import { ProductDB } from "./ProductDB";

export class Product
{

    private productId: number;
    private name: string;

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

}