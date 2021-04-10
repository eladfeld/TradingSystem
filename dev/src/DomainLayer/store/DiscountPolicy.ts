import { DiscountOption } from "./DiscountOption";

export class DiscountPolicy
{

    public static default = 'No discount policy';
    private discountPolicy: string;
    private discountOptions: DiscountOption[];

    public constructor(discountPolicy=DiscountPolicy.default)
    {
        this.discountPolicy = discountPolicy;
        this.discountOptions = [new DiscountOption()];
    }

    public setDiscountOptions(discountOptions: DiscountOption[]){
        this.discountOptions = discountOptions;
    }

}