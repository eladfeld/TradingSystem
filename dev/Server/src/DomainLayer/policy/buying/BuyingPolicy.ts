import { isFailure, makeOk, Result } from "../../../Result";
import PredicateParser from "../../discount/logic/parser";
import { iPredicate } from "../../discount/logic/Predicate";
import BuyingSubject from "./BuyingSubject";

export default class BuyingPolicy{
    private conditions:iPredicate[];

    constructor(){
        this.conditions =[];
    }

    public isSatisfied = (buyingSubject: BuyingSubject):boolean =>{
        for(var i:number =0; i<this.conditions.length; i++){
            if(!this.conditions[i].isSatisfied(buyingSubject))
                return false;
        }
        return true;
    }

    public addToPolicy = (obj: any):Result<string> =>{
        const res: Result<iPredicate> = PredicateParser.parse(obj);
        if(isFailure(res)) return res;
        this.conditions.push(res.value);
        return makeOk("successfully added condition to the buying policy");
    }

}