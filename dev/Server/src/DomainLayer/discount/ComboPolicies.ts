export interface iComboPolicy{
    calc: (discounts: number[]) => number;
    getSignature: ()=> string;
}

class ComboPolicy implements iComboPolicy{
    private f: (discounts: number[]) => number;
    private signature: string;

    constructor(f: (discounts:number[]) => number, signature: string){
        this.f = f;
        this.signature = this.signature;
    }

    public calc = (discounts: number[]): number => this.f(discounts);
    public getSignature = ():string => this.signature;

}

const getMax = (nums: number[]): number =>{
    var max = 0;
    nums.forEach((value) => max = value>max ? value : max);
    return max;
}

const getSum = (nums: number[]) =>{
    var sum = 0;
    nums.forEach((value) => sum += value);
    return sum;
}

export const ComboPolicyNames = {
    BEST: "max",
    COMBINE: "add"
};
const ComboPolicies = {
    BEST: new ComboPolicy(getMax, ComboPolicyNames.BEST),
    COMBINE: new ComboPolicy(getSum, ComboPolicyNames.COMBINE)
}
const comboPolicyMap: Map<string, iComboPolicy> = new Map([
    [ComboPolicyNames.BEST, ComboPolicies.BEST],
    [ComboPolicyNames.COMBINE, ComboPolicies.COMBINE]
]);
const getComboPolicy = (name: string): iComboPolicy =>{
    return comboPolicyMap.get(name);
}
export default getComboPolicy;