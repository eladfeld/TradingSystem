import { isFailure, makeFailure, makeOk, Result, ResultsToResult } from "../../Result";
import ComboDiscount from "./ComboDiscount";
import getComboPolicy from "./ComboPolicies";
import { iComboPolicy } from "./ComboPolicies";
import ConditionalDiscount from "./ConditionalDiscount";
import { tDiscount } from "./Discount";
import iDiscount from "./iDiscount";
import PredicateParser from "./logic/parser";
import { iPredicate, tSimpleOperand } from "./logic/Predicate";
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
    public parse = (d: tDiscount):Result<iDiscount> =>{
        const type: string = d.type;
        if(!type) return makeFailure(`type undefined in ${d}`);
        if(typeof type !== 'string') return makeFailure('type is not a string');
        
        switch (d.type) {
            case "unconditional":   
                var category: tSimpleOperand = d.category;
                var ratio: number = (typeof d.ratio === 'number')? d.ratio : Number(d.ratio);
                console.log(category, ratio)
                
                if(category===undefined || ratio===undefined)return makeFailure(`category or ratio not defined in ${d}`);
                if((typeof ratio !== 'number') || isNaN(ratio)) return makeFailure(`${ratio} is not a valid ratio (must be number) in:\n${d}`)
                if(ratio > 1 || ratio < 0) return makeFailure(`discount ratio must be between 0 and 1`);
                return makeOk(new UnconditionalDiscount(ratio, category));//TODO: support category
            case "conditional":   
                var category: tSimpleOperand = d.category;
                var ratio: number = (typeof d.ratio === 'number')? d.ratio : Number(d.ratio);
                if(category===undefined || ratio===undefined)return makeFailure(`category or ratio not defined in ${d}`);
                if((typeof ratio !== 'number') || isNaN(ratio)) return makeFailure(`${ratio} is not a valid ratio (must be number) in:\n${d}`)
                if(ratio > 1 || ratio < 0) return makeFailure(`discount ratio must be between 0 and 1`);
                if(d.predicate===undefined) return makeFailure(`conditional discount does not have a predicate in ${d}`);
                const predRes: Result<iPredicate> = PredicateParser.parse(d.predicate);
                if(isFailure(predRes))return predRes;
                return makeOk(new ConditionalDiscount(ratio, category, predRes.value));           
            case "combo":
                const policyField: string = d.policy; 
                const children: tDiscount[] = d.discounts;
                if(policyField===undefined || children===undefined)return makeFailure(`policy or children discounts not defined in ${d}`);
                if((typeof policyField !== 'string') || !Array.isArray(children)) return makeFailure(`policy is not a string or child discounts not a list in:\n ${d}`);
                const policy: iComboPolicy = getComboPolicy(d.policy);
                if(policy === undefined) return makeFailure(`${policyField} is not a valid combo policy`) ;
                if(children.length < 2) return makeFailure(`combo discount does not at least 2 child discounts in ${d}`);
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
