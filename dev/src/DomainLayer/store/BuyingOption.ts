

export enum buyingOption{
    INSTANT = "instant",
    OFFER   = "offer",
    BID     = "bid",
    RAFFLE  = "raffle",
}


export class BuyingOption {

    private option: string;

    public constructor(option=buyingOption.INSTANT) {
        this.option = option;
    }

}