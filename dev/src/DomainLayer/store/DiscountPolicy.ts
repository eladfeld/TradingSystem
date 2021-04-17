import { discountOption, DiscountOption } from "./DiscountOption";

export class DiscountPolicy
{


    public static default = 'No discount policy';
    private discountPolicy: string;
    private discounts: DiscountOption[];

    public constructor(discountPolicy=DiscountPolicy.default)
    {
        this.discountPolicy = discountPolicy;
        this.discounts = [];
    }

    public getDiscountPolicy(){
        return this.discountPolicy
    }

    public addDiscount(discount: DiscountOption)
    {
        this.discounts.push(discount)
    }

    public deleteDiscount(discountId: number)
    {
        this.discounts = this.discounts.filter(discount => discount.getId() !== discountId);
    }

    public applyDiscountPolicy(productMap: Map<number, number>) : number{
        let totalPrice = 0
        let activeDiscountPercents = []
        let now = new Date();
        now.setHours(0,0,0,0);
        for(let discount of this.discounts){
            if(discount.getDateFrom() <= now && discount.getDateUntil() >= now){
                //TODO: check for conditional discount predicats
                activeDiscountPercents.push(discount.getPercent())
            }
        }
        for(let [productPrice, quantity] of productMap){
            let discountPrice = productPrice
            for(let discount of activeDiscountPercents){
                discountPrice *= ((100 - discount)/100)
            }
            totalPrice += discountPrice*quantity
        }
        return totalPrice
    }

}