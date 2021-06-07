import Categorizer from "./Categorizer";
import Discount, { tConditionalDiscount } from "./Discount";
import {iPredicate} from "./logic/Predicate";
import iBasket from "./iBasket";
import { isFailure, makeOk, Result, ResultsToResult } from "../../Result";

export default class ConditionalDiscount extends Discount{
    private predicate: iPredicate;

    constructor(ratio: number, category: string|number, predicate: iPredicate){
        super(ratio, category);
        this.predicate = predicate;
    }

    public getDiscount = (basket: iBasket, categorizer: Categorizer):Result<number> =>  {
        const productsInCategory: number[] = this.getProductsInCategory(categorizer);
        const discountsResults: Result<number>[] = basket.getItems().map((prod) => {
            if(this.isWholeStore(productsInCategory) || productsInCategory.includes(prod.getProductId())){
                const predRes:Result<boolean> = this.predicate.isSatisfied(basket);
                if(isFailure(predRes))return predRes;
                if(predRes.value){
                    return makeOk(prod.getQuantity()*this.ratio*prod.getPrice());
                }
            }
            return makeOk(0);
        });
        const res:Result<number[]> = ResultsToResult(discountsResults);
        if(isFailure(res))return res;
        var totalDiscount: number = 0;
        res.value.forEach((discount) => totalDiscount += discount);
        return makeOk(totalDiscount);
    }

    public getPredicate = () => this.predicate;

    public toObj = ():tConditionalDiscount =>{
        return{
            type:"conditional",
            ratio:this.ratio,
            category:this.category,
            predicate:this.predicate.toObject()
        }
    }

}