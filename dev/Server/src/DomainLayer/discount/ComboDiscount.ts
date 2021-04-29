import Categorizer from "./Categorizer";
import { iComboPolicy } from "./ComboPolicies";
import Discount from "./Discount";
import iBasket from "./iBasket";
import iDiscount from "./iDiscount";

export default class ComboDiscount implements iDiscount{
    
    protected policy: iComboPolicy;
    protected discounts: iDiscount[];

    constructor(policy: iComboPolicy, discounts: iDiscount[]){
        this.policy = policy;
        this.discounts = discounts;
    }
    
    public getDiscount = (basket: iBasket, categorizer: Categorizer):number =>{
        const discounts: number[] = this.discounts.map(d => d.getDiscount(basket, categorizer));
        return this.policy.calc(discounts);
    }

    public getPolicy = () => this.policy;
    public getDiscounts = () => this.discounts;

}