import { exception } from "console";

const discountOption = {
    VISIBLE:        "visible",
    CONDITIONAL:    "conditional",
    HIDDEN:         "hidden",
}

export class DiscountOption {
    private option: string;

    public constructor(option = discountOption.VISIBLE) {
        if (!(option in discountOption)) {
            throw exception('Received invalid buying option', option = option);
        }
        this.option = option;
    }

}