import { BuyingOption } from "./BuyingOption";

export class BuyingPolicy
{

    public static default = 'No buying policy';
    private buyingPolicy: string;
    private buyingOptions: BuyingOption[];

    public constructor(buyingPolicy=BuyingPolicy.default)
    {
        this.buyingPolicy = buyingPolicy;
        this.buyingOptions = [new BuyingOption()];
    }

    public setBuyingOptions(buyingOptions: BuyingOption[]){
        this.buyingOptions = buyingOptions;
    }


}