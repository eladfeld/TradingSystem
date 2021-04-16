import { makeFailure, makeOk, Result } from "../../Result";

export enum discountOption {
    VISIBLE     = 1,
    CONDITIONAL = 2,
    HIDDEN      = 3,
}

export class DiscountOption {
    private option: discountOption;

    public constructor(option = discountOption.VISIBLE) {
        this.option = discountOption.VISIBLE;
    }

    public setDiscountOption(option: discountOption): Result<string> {
        if (!Object.values(discountOption).includes(option)) {
            return makeFailure(`Received invalid discount option: ${option}`);
        }
        this.option = option;
        return makeOk("Discount option was set")
    }

};