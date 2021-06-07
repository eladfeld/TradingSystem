import { isFailure, makeOk, Result, ResultsToResult } from "../../Result";
import Categorizer from "./Categorizer";
import { iComboPolicy } from "./ComboPolicies";
import { tComboDiscount } from "./Discount";
import iBasket from "./iBasket";
import iDiscount from "./iDiscount";

export default class ComboDiscount implements iDiscount{
    
    protected policy: iComboPolicy;
    protected discounts: iDiscount[];

    constructor(policy: iComboPolicy, discounts: iDiscount[]){
        this.policy = policy;
        this.discounts = discounts;
    }
    
    public getDiscount = (basket: iBasket, categorizer: Categorizer):Result<number> =>{
        const results: Result<number>[] = this.discounts.map(d => d.getDiscount(basket, categorizer));
        const res: Result<number[]> = ResultsToResult(results);
        if(isFailure(res)) return res;
        return makeOk(this.policy.calc(res.value));
    }

    public getPolicy = () => this.policy;
    public getDiscounts = () => this.discounts;

    public toObj = ():tComboDiscount =>{
        return{
            type:"combo",
            policy:this.policy.getSignature(),
            discounts:this.discounts.map(d => d.toObj())
        }
    }

}