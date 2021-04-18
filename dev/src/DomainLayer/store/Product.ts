import { Category, ID } from "./Common";
import { ProductDB } from "./ProductDB";

export class Product
{

    private productId: number;
    private name: string;
    private categories: Category[];

    public constructor(name: string, categories: Category[])
    {
        this.productId = ID();
        this.name = name;
        this.categories = categories;
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

    public getCategories()
    {
        return this.categories;
    }

}