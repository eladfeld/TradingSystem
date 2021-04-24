import { discountOption, DiscountOption } from "./DiscountOption";

export class DiscountPolicy
{


    public static default = 'No discount policy';
    private discountPolicy: string;

    public constructor(discountPolicy=DiscountPolicy.default)
    {
        this.discountPolicy = discountPolicy;
    }

    public getDiscountPolicy(){
        return this.discountPolicy
    }

}