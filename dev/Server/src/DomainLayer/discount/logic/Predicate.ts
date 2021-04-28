import { exception } from "console";
import iSubject from "./iSubject";

export interface iPredicate<T extends iSubject>{
    isSatisfied: (subject: T)=>boolean;
}
export interface iValue<T extends iSubject>{
    calc: (basket: T)=>number;
}

export class CompositePredicate<T extends iSubject> implements iPredicate<T>{
    protected rater: (a:boolean, b:boolean) => boolean;
    protected rands: iPredicate<T>[];

    constructor(rands: iPredicate<T>[], rater: (a:boolean, b:boolean)=>boolean){
        this.rands = rands;
        this.rater = rater;
    }

    public isSatisfied = (subject: T):boolean => {
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
  
export class SimplePredicate<T extends iSubject> implements iPredicate<T>{
    protected rater: (a:number, b:number) => boolean;
    protected rand1: iValue<T>;
    protected rand2: iValue<T>;

    constructor(rand1: iValue<T>, rand2: iValue<T>, rater: (a:number, b:number)=>boolean){
        this.rand1 = rand1;
        this.rand2 = rand2;
        this.rater = rater;
    }

    public isSatisfied = (subject: T):boolean => {
        return this.rater(this.rand1.calc(subject), this.rand2.calc(subject));
    } 
}

export class Field<T extends iSubject> implements iValue<T>{
    //protected getter:(subject: T) => number;
    private field: string;
    constructor( field: string){
        this.field = field;
    }

    public calc = (subject: T):number => {
        return subject.getValue(this.field);
        return subject.getValue("banana_quantity");
        return subject.getValue("total");
    }   
}

export class Value implements iValue<any>{
    protected value: number
    
    constructor(value: number){
        this.value = value;
    }

    public calc = ():number => {
        return this.value;
    }   
}
