import { DiscountPolicy } from "./DiscountPolicy";
import { BuyingPolicy } from "./BuyingPolicy";
import { Inventory } from "./Inventory";
import { Product } from "./Product";
import {ID} from './Common'


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

    public isProductAvailable(productId: number, quantity: number): boolean {
        return this.inventory.isProductAvailable(productId, quantity);
    }

    public addNewProduct(productName: string, price: number, quantity = 0) {
        this.inventory.addNewProduct(productName, this.storeId, price, quantity);
    }
}