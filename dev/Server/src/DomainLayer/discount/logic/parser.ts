import { exception } from "console";
import { isFailure, isOk, makeFailure, makeOk, Result, ResultsToResult } from "../../../Result";
import iSubject from "./iSubject";
import { getCompositeOperator, getSimpleOperator } from "./LogicalOperators";
import { CompositePredicate, Field, iPredicate, iValue, SimplePredicate, Value } from "./Predicate";

class Parser{
    constructor(){
        
    }
    //TODO: update iSubject to have string[] getWords() for field checks
    public parse = (json: any):Result<iPredicate> =>{
        try{
            var type: string = json.type;
            switch (type) {
                case "simple":
                    var rater: string = json.operator;
                    const rand1Res: Result<iValue> = this.parseValue(json.operand1);
                    const rand2Res: Result<iValue> = this.parseValue(json.operand2);
                    if(isFailure(rand1Res)) return rand1Res;
                    if(isFailure(rand2Res)) return rand2Res;
                    if(getSimpleOperator(rater) === undefined) return makeFailure(`invalid simple operator ${rater} in:\n${json}`);
                    return makeOk(new SimplePredicate(rand1Res.value, rand2Res.value, getSimpleOperator(rater)));
                case "composite":
                    var rater: string = json.operator;
                    const randsArr: any[] = json.operands;
                    const randsRes: Result<iPredicate[]> =  ResultsToResult(randsArr.map(p => this.parse(p)));
                    if(isFailure(randsRes)) return randsRes;
                    if(getCompositeOperator(rater) === undefined) return makeFailure(`invalid composite operator ${rater} in:\n ${json}`);
                   
                    return makeOk(new CompositePredicate(randsRes.value, getCompositeOperator(rater)));
                default:
                    return makeFailure("buying policy type must be simple or compound");
            }
            
        }catch(e){
            console.log(e);
        }

        return null;
    }

    private parseValue = (v: any):Result<iValue> =>{
        const type: string = typeof v;
        if(type === 'number')
            return makeOk(new Value(v));
        if(type === 'string')
            return makeOk(new Field(v));
        else return makeFailure("Values must be numbers or strings");
    }
}

const PredicateParser = new Parser();
export default PredicateParser;
