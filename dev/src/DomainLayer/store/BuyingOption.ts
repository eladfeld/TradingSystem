import { exception } from "console";

const buyingOption = {
    INSTANT:    "instant",
    OFFER:      "offer",
    BID:        "bid",
    RAFFLE:     "raffle",
}


export class BuyingOption {

    private option: string;

    public constructor(option=buyingOption.INSTANT) {
        if(!(option in buyingOption)){
            throw exception('Received invalid buying option', option=option);
        }
        this.option = option;
    }

}