export interface iComboPolicy{
    calc: (discounts: number[]) => number;
}

class ComboPolicy implements iComboPolicy{
    private f: (discounts: number[]) => number;

    constructor(f: (discounts:number[]) => number){
        this.f = f;
    }

    public calc = (discounts: number[]): number => this.f(discounts);

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

const ComboPolicies = {
    BEST: new ComboPolicy(getMax),
    COMBINE: new ComboPolicy(getSum)
}
export const ComboPolicyNames = {
    BEST: "max",
    COMBINE: "add"
};
const comboPolicyMap: Map<string, iComboPolicy> = new Map([
    [ComboPolicyNames.BEST, ComboPolicies.BEST],
    [ComboPolicyNames.COMBINE, ComboPolicies.COMBINE]
]);
const getComboPolicy = (name: string): iComboPolicy =>{
    return comboPolicyMap.get(name);
}
export default getComboPolicy;