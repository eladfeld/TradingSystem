import { buyingOption, BuyingOption } from "./BuyingOption";

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

    public hasBuyingOption(option: buyingOption) {
        return this.buyingOptions.some( buyingOption => buyingOption.getBuyingOption() === option )
    }

    public addBuyingOption(buyingOption: BuyingOption)
    {
        // This overiddes the current if exists
        this.deleteBuyingOption(buyingOption.getBuyingOption())
        this.buyingOptions.push(buyingOption)
    }

    public deleteBuyingOption( buyingOption: buyingOption)
    {
        this.buyingOptions = this.buyingOptions.filter(option => option.getBuyingOption() !== buyingOption);
    }


}