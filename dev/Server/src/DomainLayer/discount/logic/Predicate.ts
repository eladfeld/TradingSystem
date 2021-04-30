import { exception } from "console";
import iSubject from "./iSubject";

export interface iPredicate{
    isSatisfied: (subject: iSubject)=>boolean;
}
export interface iValue{
    calc: (basket: iSubject)=>number;
}

export class CompositePredicate<T extends iSubject> implements iPredicate{
    protected rater: (a:boolean, b:boolean) => boolean;
    protected rands: iPredicate[];

    constructor(rands: iPredicate[], rater: (a:boolean, b:boolean)=>boolean){
        this.rands = rands;
        this.rater = rater;
    }

    public isSatisfied = (subject: iSubject):boolean => {
        if(this.rands.length < 2){
            throw exception("not enough operands");
        }
        var acc: boolean = this.rater(this.rands[0].isSatisfied(subject), this.rands[1].isSatisfied(subject));
        for(var i:number = 2; i<this.rands.length; i++){
            acc = this.rater(acc, this.rands[i].isSatisfied(subject));
        }
        return acc;
    }
}
  
export class SimplePredicate<T extends iSubject> implements iPredicate{
    protected rater: (a:number, b:number) => boolean;
    protected rand1: iValue;
    protected rand2: iValue;

    constructor(rand1: iValue, rand2: iValue, rater: (a:number, b:number)=>boolean){
        this.rand1 = rand1;
        this.rand2 = rand2;
        this.rater = rater;
    }

    public isSatisfied = (subject: iSubject):boolean => {
        return this.rater(this.rand1.calc(subject), this.rand2.calc(subject));
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
        return subject.getValue("banana_quantity");
        return subject.getValue("total");
    }   
}

export class Value implements iValue{
    protected value: number
    
    constructor(value: number){
        this.value = value;
    }

    public calc = ():number => {
        return this.value;
    }   
}
