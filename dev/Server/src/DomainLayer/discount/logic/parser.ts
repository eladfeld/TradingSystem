import { isFailure, makeFailure, makeOk, Result, ResultsToResult } from "../../../Result";
import { getCompositeOperator, getSimpleOperator } from "./LogicalOperators";
import { CompositePredicate, Field, iPredicate, iValue, SimplePredicate, tPredicate, Value } from "./Predicate";

class Parser{
    constructor(){
        
    }
    //TODO: update iSubject to have string[] getWords() for field checks
    public parse = (json: tPredicate):Result<iPredicate> =>{
        try{
            switch (json.type) {
                case "simple":
                    var rater: string = json.operator;
                    if(rater === undefined) return makeFailure("operator is undefined in simple predicate");
                    const rand1Res: Result<iValue> = this.parseValue(json.operand1);
                    const rand2Res: Result<iValue> = this.parseValue(json.operand2);
                    if(isFailure(rand1Res)) return rand1Res;
                    if(isFailure(rand2Res)) return rand2Res;
                    if(getSimpleOperator(rater) === undefined) return makeFailure(`invalid simple operator ${rater} in:\n${json}`);
                    return makeOk(new SimplePredicate(rand1Res.value, rand2Res.value, getSimpleOperator(rater)));
                case "composite":
                    var rater: string = json.operator;
                    if(rater === undefined) return makeFailure("operator is undefined in composite predicate");
                    const randsArr: any[] = json.operands;
                    if(randsArr === undefined) return makeFailure("operands are undefined in composite predicate");
                    if(!Array.isArray(randsArr)) return makeFailure("operands is not array in composite predicate");
                    if(randsArr.length < 2) return makeFailure("composite predicates must have at least 2 operands");
                    const randsRes: Result<iPredicate[]> =  ResultsToResult(randsArr.map(p => this.parse(p)));
                    if(isFailure(randsRes)) return randsRes;
                    if(getCompositeOperator(rater) === undefined) return makeFailure(`invalid composite operator ${rater} in composite predicate:\n ${json}`);                   
                    return makeOk(new CompositePredicate(randsRes.value, getCompositeOperator(rater)));
                default:
                    return makeFailure("buying policy type must be simple or composite");
            }            
        }catch(e){
            console.log(e);
        }

        return null;
    }

    private parseValue = (v: any):Result<iValue> =>{
        if(v === undefined) return makeFailure("value is undefined in simple predicate");
        const type: string = typeof v;
        if(type === 'number')
            return makeOk(new Value(v));
        if(type === 'string'){
            const num: number = Number(v);
            if(!isNaN(num)) return makeOk(new Value(num));
            return makeOk(new Field(v));
        }
        else return makeFailure("Values must be numbers or strings");
    }
}

const PredicateParser = new Parser();
export default PredicateParser;
