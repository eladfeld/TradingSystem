import { iProduct } from "../discount/iProduct";
import { ID, TreeRoot } from "./Common";

export class StoreInfo
{

    private storeName: string;
    private storeId: number;
    private storeProducts: StoreProductInfo[];
    private categories: StoreCategoryInfo[];

    public constructor(storeName: string, storeId: number, storeProducts: StoreProductInfo[], categories: TreeRoot<string>)
    {
        this.storeName = storeName;
        this.storeId = storeId;
        this.storeProducts = storeProducts;
        this.categories = [new StoreCategoryInfo('Food', 'Apple')]
    }

    public getStoreProducts()
    {
        return this.storeProducts;
    }

    public getStoreName()
    {
        return this.storeName;
    }

    public getStoreId()
    {
        return this.storeId;
    }

    public getCategories()
    {
        return this.categories;
    }

    public toString(): string {
        return `storeName: ${this.storeName} `.concat(this.storeProducts.toString())
    }

}

export class StoreProductInfo implements iProduct
{

    private productName: string;
    private productId: number;
    private price: number;
    private storeId: number;
    private quantity: number;
    private productRating: number;
    private numOfRaters: number;
    private categories: string[];
    private image: string;


    public constructor(productName: string, productId: number, price: number, storeId:number, quantity: number, productRating: number, numOfRaters: number, categories: string[], image: string)
    {
        this.productName = productName;
        this.productId = productId;
        this.price = price;
        this.storeId = storeId;
        this.quantity = quantity;
        this.productRating = productRating;
        this.numOfRaters = numOfRaters;
        this.categories = categories;
        this.image = image;
    }

    public getImage()
    {
        return this.image;
    }

    getCategories = ():string[] => {
        return this.categories;
    }

    public getProductId()
    {
        return this.productId;
    }

    public getName()
    {
        return this.productName;
    }

    public getPrice()
    {
        return this.price;
    }

    public getStoreId()
    {
        return this.storeId;
    }

    public getProductRating()
    {
        return this.productRating;
    }

    public getQuantity()
    {
        return this.quantity;
    }

    public getNumOfRaters()
    {
        return this.numOfRaters;
    }

    public toString(): string {
        return `product name: ${this.productName}\tprice: ${this.price}\tproduct rating:\t${this.productRating}\tnumber of raters: ${this.numOfRaters}`
    }

}


export class StoreCategoryInfo
{

    private sub_cat: string;
    private main_cat: string;

    public constructor(main_cat: string, sub_cat:string)
    {
        this.sub_cat = sub_cat;
        this.main_cat = main_cat;
    }

}