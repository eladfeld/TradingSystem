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
Object.freeze(ComboPolicies);
export default ComboPolicies;
