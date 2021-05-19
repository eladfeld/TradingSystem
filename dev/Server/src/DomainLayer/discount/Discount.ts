import { Result } from "../../Result";
import iCategorizer from "./Categorizer";
import iBasket from "./iBasket";
// import iCategory from "./iCategory";
import iDiscount from "./iDiscount";
import { tPredicate } from "./logic/Predicate";

export default abstract class Discount implements iDiscount{
    public static WHOLE_STORE: number = 0;
    protected ratio: number;
    protected category: string|number;
    public getDiscount: (basket: iBasket, categorizer: iCategorizer) => Result<number>;

    constructor(ratio: number, category:string|number){
        this.ratio=ratio;
        this.category=category;
    }

    public getRatio = () => this.ratio;
    public getCategory = () => this.category;
    public getProductsInCategory = (categorizer: iCategorizer):number[] => {
        const c: string|number = this.category;
        return (typeof c === 'number') ? [c] : categorizer.getProducts(c);
    }

    public isWholeStore = (products: number[]): boolean =>{
        return (products.length===1 && products[0]===Discount.WHOLE_STORE);
    }
}

export type tUnconditionalDiscount = {type:"unconditional",category:string, ratio:number};
export type tConditionalDiscount = {type:"conditional",category:string, ratio:number, predicate:tPredicate};
export type tSimpleDiscount = tUnconditionalDiscount | tConditionalDiscount;
export type tDiscount = tSimpleDiscount | tComboDiscount;
export type tComboDiscount = {type:"combo", policy:string, discounts:tDiscount[]};