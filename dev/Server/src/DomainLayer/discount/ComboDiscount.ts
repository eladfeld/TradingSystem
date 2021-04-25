import Categorizer from "./Categorizer";
import { iComboPolicy } from "./ComboPolicies";
import Discount from "./Discount";
import iBasket from "./iBasket";
import iDiscount from "./iDiscount";

export default class ComboDiscount implements iDiscount{
    
    protected policy: iComboPolicy;
    protected discounts: iDiscount[];
    
    public getDiscount = (basket: iBasket, categorizer: Categorizer):number =>{
        const discounts: number[] = this.discounts.map(d => d.getDiscount(basket, categorizer));
        return this.policy.calc(discounts);
    }

}