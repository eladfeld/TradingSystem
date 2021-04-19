import { makeFailure, makeOk, Result } from "../../Result";


export enum buyingOption{
    INSTANT = 0,
    OFFER   = 1,
    BID     = 2,
    RAFFLE  = 3,
}


export class BuyingOption {

    private option: buyingOption;

    public constructor() {
        this.option = buyingOption.INSTANT;
    }

    public getBuyingOption(): number{
        return this.option;
    }

    public setBuyingOption(option: buyingOption): Result<string> {
        if (!Object.values(buyingOption).includes(option)) {
            return makeFailure(`Received invalid buying option: ${option}`);
        }
        this.option = option;
        return makeOk("Buying option was set")
    }

}