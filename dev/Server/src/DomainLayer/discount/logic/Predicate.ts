export interface iPredicate{
    calc: (basket: number[][])=>boolean;
}
export interface iValue{
    calc: (basket: number[][])=>number;
}

export class CompositePredicate implements iPredicate{
    protected rater: (a:boolean, b:boolean) => boolean;
    protected rand1: iPredicate;
    protected rand2: iPredicate;

    constructor(rand1: iPredicate, rand2: iPredicate, rater: (a:boolean, b:boolean)=>boolean){
        this.rand1 = rand1;
        this.rand2 = rand2;
        this.rater = rater;
    }

    public calc = (basket: number[][]):boolean => {
        return this.rater(this.rand1.calc(basket), this.rand2.calc(basket));
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

    public calc = (basket: number[][]):boolean => {
        return this.rater(this.rand1.calc(basket), this.rand2.calc(basket));
    } 
}

export class Field implements iValue{
    protected getter:(basket: number[][]) => number;
    
    constructor( getter: (basket: number[][]) => number ){
        this.getter = getter;
    }

    public calc = (basket: number[][]):number => {
        return this.getter(basket);
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
