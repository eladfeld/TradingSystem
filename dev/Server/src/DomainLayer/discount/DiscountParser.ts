import { exception } from "console";
import { isFailure, makeFailure, makeOk, Result, ResultsToResult } from "../../Result";
import { DiscountPolicy } from "../store/DiscountPolicy";
import ComboDiscount from "./ComboDiscount";
import getComboPolicy from "./ComboPolicies";
import ComboPolicies, { iComboPolicy } from "./ComboPolicies";
import ConditionalDiscount from "./ConditionalDiscount";
import iBasket from "./iBasket";
import iDiscount from "./iDiscount";
import PredicateParser from "./logic/parser";
import { iPredicate } from "./logic/Predicate";
import UnconditionalDiscount from "./UnconditionalDiscount";


const example: any = {
    type: "combo",
    policy: "add",
    discounts:[
        {
            type: "unconditional",
            category: 1,
            ratio: 0.15
        },
        {
            type: "conditional",
            category: "fruit",
            ratio: 0.15,
            condtion:{
                type: "simple",
                operand1: 5,
                operator: ">",
                operand2: 2
            }
        }
    ]};

class Parser{
    constructor(){
        
    }
    //TODO: update iSubject to have string[] getWords() for field checks
    public parse = (d: any):Result<iDiscount> =>{
        const type: string = d.type;
        switch (type) {
            case "unconditional":   
                var category: any = d.category;
                var ratio: number = d.ratio;
                return makeOk(new UnconditionalDiscount(ratio, category));//TODO: support category
            case "conditional":   
                var category: any = d.category;
                var ratio: number = d.ratio;
                const predRes: Result<iPredicate> = PredicateParser.parse(d.predicate);
                if(isFailure(predRes))return predRes;
                return makeOk(new ConditionalDiscount(ratio, category, predRes.value));           
            case "combo":
                const policy: iComboPolicy = getComboPolicy(d.policy);  
                const children: any[] = d.discounts;
                const discountsRes: Result<iDiscount[]> = ResultsToResult(children.map(disc => this.parse(disc)));
                if(isFailure(discountsRes)) return discountsRes;
                return makeOk(new ComboDiscount(policy,discountsRes.value));        
            default:
                return makeFailure("discount type must be un/conditional or combo");
        }
    }
}

const DiscountParser = new Parser();
export default DiscountParser;
