import { makeFailure, makeOk, Result } from "../../Result";

const discountOption = {
    VISIBLE:        "visible",
    CONDITIONAL:    "conditional",
    HIDDEN:         "hidden",
};

export class DiscountOption {
    private option: string;

    public constructor(option = discountOption.VISIBLE) {
        this.option = discountOption.VISIBLE;
    }

    public setDiscountOption(option: string): Result<string> {
        if (!(option === discountOption.VISIBLE || option === discountOption.CONDITIONAL || option === discountOption.HIDDEN)) {
            return makeFailure("Received invalid discount option: " + option);
        }
        this.option = option;
        return makeOk("Discount option was set")
    }

};