import { ID } from "./Common";

export class StoreInfo
{

    private storeName: string;
    private storeId: number;
    private storeProducts: StoreProductInfo[];

    public constructor(storeName: string, storeId: number, storeProducts: StoreProductInfo[])
    {
        this.storeName = storeName;
        this.storeId = storeId;
        this.storeProducts = storeProducts;
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

    public toString(): string {
        return `storeName: ${this.storeName} `.concat(this.storeProducts.toString())
    }

}

export class StoreProductInfo
{

    private productName: string;
    private productId: number;
    private price: number;
    private storeId: number;
    private quantity: number;
    private productRating: number
    private numOfRaters: number


    public constructor(productName: string, productId: number, price: number, storeId:number, quantity: number, productRating: number, numOfRaters: number)
    {
        this.productName = productName;
        this.productId = productId;
        this.price = price;
        this.storeId = storeId;
        this.quantity = quantity;
        this.productRating = productRating;
        this.numOfRaters = numOfRaters;

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

    public getNumOfRaters()
    {
        return this.numOfRaters;
    }

    public getQuantity()
    {
        return this.quantity;
    }

    public toString(): string {
        return `product name: ${this.productName}\tprice: ${this.price}\tproduct rating:\t${this.productRating}\tnumber of raters: ${this.numOfRaters}`
    }

}