import { DiscountPolicy } from "./DiscountPolicy";
import { BuyingPolicy } from "./BuyingPolicy";
import { Inventory } from "./Inventory";
import { Product } from "./Product";


export class Store
{

    private storeId: number;
    private storeOwner: number;
    private discountPolicy: DiscountPolicy;
    private buyingPolicy: BuyingPolicy;
    private inventory: Inventory;

    // TODO: change store owner type
    public constructor(storeOwner: number, discountPolicy = DiscountPolicy.default, buyingPolicy = BuyingPolicy.default)
    {
        this.storeId = ID();
        this.storeOwner = storeOwner;
        this.discountPolicy = new DiscountPolicy(discountPolicy);
        this.buyingPolicy = new BuyingPolicy(buyingPolicy);
        this.inventory = new Inventory();
    }

    public getStoreId()
    {
        return this.storeId;
    }

    // TODO: decide on primary key for product (name, storeID) or (productId)
    // searching a product by id or by name ?
    // how do you get the id when we only get the name from the user ?
    public isProductAvailable(productName: string, quantity: number): boolean {
        return this.inventory.isProductAvailable(productName, quantity);
    }

    public addNewProduct(productName: string, storeId: number, price: number, quantity = 0) {
        this.inventory.addNewProduct(productName, storeId, price, quantity);
    }
}