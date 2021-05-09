import { buyingOption } from "./BuyingOption";

export class BuyingPolicy
{


    public static default = 'No buying policy';
    private buyingPolicy: string;

    public constructor(buyingPolicy=BuyingPolicy.default)
    {
        this.buyingPolicy = buyingPolicy;
    }

}