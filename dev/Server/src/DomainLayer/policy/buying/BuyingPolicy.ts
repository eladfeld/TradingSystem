import { isFailure, makeOk, Result } from "../../../Result";
import iSubject from "../../discount/logic/iSubject";
import PredicateParser from "../../discount/logic/parser";
import { iPredicate } from "../../discount/logic/Predicate";
import BuyingSubject from "./BuyingSubject";

export class Rule{
    public predicate: iPredicate;               //the condition (i.e. 'no alcohol for minors', 'only babies can buy iPhones')    
    public description: string;                 //a message explaining the rule

    constructor(predicate:iPredicate, description:string){
        this.predicate = predicate;             
        this.description = description;         
    }
}

export default class BuyingPolicy{
    private nextId: number = 1;                 //an id (unique to the store) for each rule in the policy
    private rules: Map<number,Rule>;            //the rules for buying at the store
    public static SUCCESS: string = "buying policy is respected";

    constructor(){
        this.rules = new Map();
    }

    //TODO: figure out...
    //the problem: there are 3 possibilities. 1) rule is satisfied, 2) rule is not satisfied, 3) issue with calculation
    // 1=> makeOK, 3 => makeFailue, 2 => ???
    //possibly should return Result<Result<>>???

    //determines if the BuyingPolicy is obeyed (if and only if all Rules are satisfied)
    public isSatisfied = (buyingSubject: BuyingSubject): Result<string> =>{
        for(const [key, rule] of this.rules.entries()){
            const res: Result<boolean> =  rule.predicate.isSatisfied(buyingSubject);
            if(isFailure(res)) return res;
            if(!res.value) return makeOk(rule.description);
        }
        return makeOk(BuyingPolicy.SUCCESS);
    }

    public addPolicy = (predicate: any, policyInWords: string ):Result<string> =>{
        const predRes: Result<iPredicate> = PredicateParser.parse(predicate);
        if(isFailure(predRes)) return predRes;
        this.rules.set(this.nextId++, new Rule(predRes.value, policyInWords));
        return makeOk("successfully added condition to the buying policy");
    }

    public removePolicy = (id: number) =>{
        this.rules.delete(id);
    }

}