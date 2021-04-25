import iSubject from "./iSubject";

export interface iPredicate<T extends iSubject>{
    isSatisfied: (subject: T)=>boolean;
}
export interface iValue<T extends iSubject>{
    calc: (basket: T)=>number;
}

export class CompositePredicate<T extends iSubject> implements iPredicate<T>{
    protected rater: (a:boolean, b:boolean) => boolean;
    protected rand1: iPredicate<T>;
    protected rand2: iPredicate<T>;

    constructor(rand1: iPredicate<T>, rand2: iPredicate<T>, rater: (a:boolean, b:boolean)=>boolean){
        this.rand1 = rand1;
        this.rand2 = rand2;
        this.rater = rater;
    }

    public isSatisfied = (subject: T):boolean => {
        return this.rater(this.rand1.isSatisfied(subject), this.rand2.isSatisfied(subject));
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
