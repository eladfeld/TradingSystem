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

    public getDiscount = async (basket: iBasket, categorizer: Categorizer):Promise<number> =>  {
        const productsInCategoryp: Promise<number[]> = this.getProductsInCategory(categorizer);
        return new Promise((resolve, reject) => {
            productsInCategoryp.then(async productsInCategory => {
                const discountsResults: Result<number>[] = (await basket.getItems()).map((prod) => {
                    if(this.isWholeStore(productsInCategory) || productsInCategory.includes(prod.getProductId())){
                        const predRes = this.predicate.isSatisfied(basket);
                        if(isFailure(predRes))return predRes;
                        if(predRes.value){
                            return makeOk(prod.getQuantity()*this.ratio*prod.getPrice());
                        }
                    }
                    return makeOk(0);
                });
                const res:Result<number[]> = ResultsToResult(discountsResults);
                if(isFailure(res)) return reject(res.message);
                var totalDiscount: number = 0;
        
                res.value.forEach((discount) => totalDiscount += discount);
                resolve(totalDiscount);
            })
        })
        
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