import { isFailure, makeOk, Result } from "../../Result";
import PredicateParser from "../discount/logic/parser";
import { iPredicate } from "../discount/logic/Predicate";
import Categorizer from "./Categorizer";
import DiscountParser from "./DiscountParser";
import iBasket from "./iBasket";
import iDiscount from "./iDiscount";

export default class DiscountPolicy implements iDiscount{
    private nextId: number = 1;
    private discounts: Map<number,iDiscount>;

    constructor(){
        this.discounts = new Map();
    }
    public getDiscount = (basket: iBasket, categorizer: Categorizer): Result<number> =>{
        var acc: number =0;
        for(const [key, discount] of this.discounts.entries()){
            const discountRes:Result<number> = discount.getDiscount(basket,categorizer);
            if(isFailure(discountRes)) return discountRes;
            acc += discountRes.value;
        }
        return makeOk(acc);
    }

    public addPolicy = (obj: any):Result<string> =>{
        const res: Result<iDiscount> = DiscountParser.parse(obj);
        if(isFailure(res)) return res;
        this.discounts.set(this.nextId++, res.value);
        return makeOk("successfully added discount to the discount policy");
    }

    public removePolicy = (id: number) =>{
        this.discounts.delete(id);
    }

}