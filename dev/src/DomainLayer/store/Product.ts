import { ID } from "./Common";
import { ProductDB } from "./ProductDB";

export class Product
{

    private productId: number;
    private name: string;
    private category: string;

    public constructor(name: string, category: string)
    {
        this.productId = ID();
        this.name = name;
        this.category = category;
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

    public getCategory()
    {
        return this.category;
    }

}