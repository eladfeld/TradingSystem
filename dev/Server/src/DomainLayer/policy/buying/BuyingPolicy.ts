import { isFailure, makeOk, Result } from "../../../Result";
import PredicateParser from "../../discount/logic/parser";
import { iPredicate } from "../../discount/logic/Predicate";
import BuyingSubject from "./BuyingSubject";

export class Rule{
    public name: string;
    public predicate: iPredicate;
    public message: string;

    constructor(name:string, predicate:iPredicate, message:string){
        this.name = name;
        this.predicate = predicate;
        this.message = message;    
    }
}

export default class BuyingPolicy{
    private nextId: number = 1;
    private rules: Map<number,Rule>;

    constructor(){
        this.rules = new Map();
    }

    //TODO: figure out...
    //the problem: there are 3 possibilities. 1) rule is satisfied, 2) rule is not satisfied, 3) issue with calculation
    // 1=> makeOK, 3 => makeFailue, 2 => ???
    //possibly should return Result<Result<>>???
    public isSatisfied = (buyingSubject: BuyingSubject): Result<string> =>{
        for(const [key, rule] of this.rules.entries()){
            const res: Result<boolean> =  rule.predicate.isSatisfied(buyingSubject);
            if(isFailure(res)) return res;
            if(!res.value) return makeOk(rule.message);
        }
        return makeOk("success");
    }

    public addPolicy = (predicate: any, name:string, message: string ):Result<string> =>{
        const predRes: Result<iPredicate> = PredicateParser.parse(predicate);
        if(isFailure(predRes)) return predRes;
        this.rules.set(this.nextId++, new Rule(name, predRes.value, message));
        return makeOk("successfully added condition to the buying policy");
    }

    public removePolicy = (id: number) =>{
        this.rules.delete(id);
    }

}