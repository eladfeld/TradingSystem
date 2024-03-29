import { isFailure, makeFailure, makeOk, Result } from "../../../Result";
import iSubject from "./iSubject";
import { compositeOpToString, simpleOpToString } from "./LogicalOperators";

export interface iPredicate{
    //isValid: (f:(field: tSimpleOperand)=>boolean)=>boolean;
    isSatisfied: (subject: iSubject)=>Result<boolean>;
    toObject: () => tPredicate;
}
export interface iValue{
    calc: (basket: iSubject)=>number;
    toString: () => string;
    toValue: () => tSimpleOperand;
}

export class CompositePredicate implements iPredicate{
    protected rater: (a:boolean, b:boolean) => boolean;
    protected rands: iPredicate[];

    constructor(rands: iPredicate[], rater: (a:boolean, b:boolean)=>boolean){
        this.rands = rands;
        this.rater = rater;
    }

    public isSatisfied = (subject: iSubject):Result<boolean> => {
        if(this.rands.length < 2){
            return makeFailure("predicate has less than 2 operands");
        }
        const res1: Result<boolean> = this.rands[0].isSatisfied(subject);
        if(isFailure(res1))return res1;
        const res2: Result<boolean> = this.rands[1].isSatisfied(subject);
        if(isFailure(res2))return res2;
        var acc:boolean = this.rater(res1.value, res2.value);
        for(var i:number = 2; i<this.rands.length; i++){
            const res: Result<boolean> = this.rands[i].isSatisfied(subject);
            if(isFailure(res))return res;
            acc = this.rater(acc, res.value);
        }
        return makeOk(acc);
    }

    public toObject = ():tCompositePredicate => {
        return {
            type:"composite",
            operator:compositeOpToString(this.rater),
            operands: this.rands.map(r => r.toObject())
        };
    }
}
  
export class SimplePredicate implements iPredicate{
    protected rater: (a:number, b:number) => boolean;
    protected rand1: iValue;
    protected rand2: iValue;

    constructor(rand1: iValue, rand2: iValue, rater: (a:number, b:number)=>boolean){
        this.rand1 = rand1;
        this.rand2 = rand2;
        this.rater = rater;
    }

    public isSatisfied = (subject: iSubject):Result<boolean> => {
        const val1: number = this.rand1.calc(subject);
        if(val1 === undefined) return makeFailure(`'${this.rand1.toString()}' is not a valid value for iSubject ${subject.constructor.name}`);
        const val2: number = this.rand2.calc(subject);
        if(val2 === undefined) return makeFailure(`'${this.rand2.toString()}' is not a valid value for iSubject ${subject.constructor.name}`);
        return makeOk(this.rater(val1, val2));
    } 

    public toObject = ():tSimplePredicate =>{
        return{
            type:"simple",
            operand1:this.rand1.toValue(),
            operator:simpleOpToString(this.rater), 
            operand2:this.rand2.toValue()
        }
    }

}

export class Field implements iValue{
    //protected getter:(subject: T) => number;
    private field: string;
    constructor( field: string){
        this.field = field;
    }

    public calc = (subject: iSubject):number => {
        return subject.getValue(this.field);
    }   
    public toString = (): string => this.field;
    public toValue = ():tSimpleOperand => this.field;
}

export class Value implements iValue{
    protected value: number
    
    constructor(value: number){
        this.value = value;
    }

    public calc = ():number => {
        return this.value;
    }   

    public toString = ():string =>`${this.value}`;
    public toValue = ():tSimpleOperand => this.value;


}

export type tSimpleOperand = number | string;
export type tPredicate = tSimplePredicate | tCompositePredicate;
export type tSimplePredicate = {type:"simple",operand1:tSimpleOperand, operator:string, operand2:tSimpleOperand};
export type tCompositePredicate = {type:"composite", operator:string, operands: tPredicate[]};