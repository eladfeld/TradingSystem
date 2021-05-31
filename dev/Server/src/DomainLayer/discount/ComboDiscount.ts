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
    
    public getDiscount = (basket: iBasket, categorizer: Categorizer):Promise<number> =>{
        const promises: Promise<number>[] = this.discounts.map(d => d.getDiscount(basket, categorizer));
        return new Promise((resolve,reject) =>{
            Promise.all(promises).then( discounts =>{
                resolve(this.policy.calc(discounts))
            })
            .catch( error => reject(error))
        })
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