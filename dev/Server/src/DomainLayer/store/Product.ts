import { ProductDB } from "../../DataAccessLayer/DBinit";
import { ID } from "./Common";

export class Product
{

    private productId: number;
    private name: string;
    private categories: string[];

    public constructor(name: string, categories: string[])
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