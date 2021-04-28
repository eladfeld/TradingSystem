import { exception } from "console";
import iSubject from "./iSubject";
import { getCompositeOperator, getSimpleOperator } from "./LogicalOperators";
import { CompositePredicate, Field, iPredicate, iValue, SimplePredicate, Value } from "./Predicate";

class Parser<T extends iSubject>{
    constructor(){
        
    }
    //TODO: update iSubject to have string[] getWords() for field checks
    public parse = (json: any):iPredicate<T> =>{
        try{
            var type: string = json.type;
            switch (type) {
                case "simple":
                    var rater: string = json.operator;
                    const rand1: iValue<T> = this.parseValue(json.operand1);
                    const rand2: iValue<T> = this.parseValue(json.operand2);
                    return new SimplePredicate(rand1, rand2, getSimpleOperator(rater));
                case "composite":
                    var rater: string = json.operator;
                    const randsArr: any[] = json.operands;
                    const rands: iPredicate<T>[] =  randsArr.map(p => this.parse(p));
                    return new CompositePredicate(rands, getCompositeOperator(rater));
                default:
                    throw exception("type must be simple or compound");
            }
            
        }catch(e){
            console.log(e);
        }

        return null;
    }

    private parseValue = (v: any):iValue<T> =>{
        const type: string = typeof v;
        if(type === 'number')
            return new Value(v);
        if(type === 'string')
            return new Field(v);
        else throw exception("Values must be numbers or strings")
    }
}

const PredicateParser = new Parser();
export default PredicateParser;
