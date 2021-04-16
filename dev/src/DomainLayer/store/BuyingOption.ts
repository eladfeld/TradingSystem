import { makeFailure, makeOk, Result } from "../../Result";


export enum buyingOption{
    INSTANT = "instant",
    OFFER   = "offer",
    BID     = "bid",
    RAFFLE  = "raffle",
}


export class BuyingOption {

    private option: string;

    public constructor() {
        this.option = buyingOption.INSTANT;
    }

    public setBuyingOption(option: string): Result<string> {
        if (!(option === buyingOption.BID || option === buyingOption.INSTANT || option === buyingOption.OFFER || option == buyingOption.RAFFLE)) {
            return makeFailure("Received invalid buying option: " + option);
        }
        this.option = option;
        return makeOk("Buying option was set")
    }

}