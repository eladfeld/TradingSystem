import { DiscountPolicy } from "./DiscountPolicy";
import { BuyingPolicy } from "./BuyingPolicy";
import { Inventory } from "./Inventory";
import { Product } from "./Product";
import {ID} from './Common'
import { Appointment } from "../user/Appointment";
import { Result } from "../../Result";
import { StoreHistory } from "./StoreHistory";
import { StoreDB } from "./StoreDB";


export class Store
{

    getStoreOwnerId():number
    {
        return this.storeOwner;
    }

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
        StoreDB.addStore(this);
    }

    public getStoreId()
    {
        return this.storeId;
    }

    public setStoreId(id : number) : void
    {
        this.storeId = id;
    }

    public isProductAvailable(productId: number, quantity: number): Result<string> {
        return this.inventory.isProductAvailable(productId, quantity);
    }

    public addNewProduct(productName: string, price: number, quantity = 0): Result<string> {
        return this.inventory.addNewProduct(productName, this.storeId, price, quantity);
    }

    public addAppointment(appointment : Appointment) : void
    {}

    public deleteAppointment(appointment : Appointment) : void
    {}

    public getAppointments(): Appointment[]
    {return undefined}

    public openForImmediateAuction(productId : number) : boolean
    {return true;}

    public calculatePrice(products : Map<number,number>) : number
    {return 0;}
}