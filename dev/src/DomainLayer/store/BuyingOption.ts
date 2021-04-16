import { makeFailure, makeOk, Result } from "../../Result";


export enum buyingOption{
    INSTANT = 1,
    OFFER   = 2,
    BID     = 3,
    RAFFLE  = 4,
}


export class BuyingOption {

    private option: buyingOption;

    public constructor() {
        this.option = buyingOption.INSTANT;
    }

    public setBuyingOption(option: buyingOption): Result<string> {
        if (!Object.values(buyingOption).includes(option)) {
            return makeFailure(`Received invalid buying option: ${option}`);
        }
        this.option = option;
        return makeOk("Buying option was set")
    }

}