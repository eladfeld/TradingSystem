import { isFailure, makeFailure, makeOk, Result } from "../../Result";
import Categorizer from "./Categorizer";
import { tDiscount } from "./Discount";
import DiscountParser from "./DiscountParser";
import iBasket from "./iBasket";
import iDiscount from "./iDiscount";


//The DiscountPolicy manages a data structure for all of a stores discounts
//and can calculate the discount for a given iBasket.
export default class DiscountPolicy{
    private nextId: number = 1;
    private discounts: Map<number,iDiscount>;

    constructor(){
        this.discounts = new Map();
    }

    //returns the best discount that the basket can recieve according to the policy
    public getDiscount = (basket: iBasket, categorizer: Categorizer): Result<number> =>{
        var acc: number =0;
        for(const [key, discount] of this.discounts.entries()){
            const discountRes:Result<number> = discount.getDiscount(basket,categorizer);
            if(isFailure(discountRes)) return discountRes;
            acc += discountRes.value;
        }
        
        return makeOk(acc);
    }

    //adds a new iDiscount to the policy. If @obj is invalid, returns Failure explaining why.
    public addPolicy = (obj: any):Promise<string> =>{
        //TODO: #saveDB
        const res: Result<iDiscount> = DiscountParser.parse(obj);
        if(isFailure(res)) return Promise.reject(res.message);
        this.discounts.set(this.nextId++, res.value);
        return Promise.resolve("successfully added discount to the discount policy");
    }

    public removePolicy = (id: number):Promise<string> =>{
        //TODO: #saveDB
        const policy = this.discounts.get(id);
        if(policy === undefined)return Promise.reject("polcy does not exist");
        this.discounts.delete(id);
        return Promise.resolve(`Discount Policy #${id} has been removed`);
    }

    public toObjs = ():tStoreDiscount[] =>{
        const output:tStoreDiscount[] = [];
        this.discounts.forEach((discount:iDiscount, id:number) => {
            output.push({id, discount:discount.toObj()});
        });
        return output;
    }

}
type tStoreDiscount = {id: number, discount: tDiscount}; 