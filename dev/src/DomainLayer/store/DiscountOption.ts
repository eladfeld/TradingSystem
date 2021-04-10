
const discountOption = {
    VISIBLE:        "visible",
    CONDITIONAL:    "conditional",
    HIDDEN:         "hidden",
};

export class DiscountOption {
    private option: string;

    public constructor(option = discountOption.VISIBLE) {
        if (!(option === discountOption.VISIBLE || option === discountOption.CONDITIONAL || option === discountOption.HIDDEN)) {
            throw "Received invalid buying option " + option;
        }
        this.option = option;
    }

};