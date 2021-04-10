
const buyingOption = {
    INSTANT:    "instant",
    OFFER:      "offer",
    BID:        "bid",
    RAFFLE:     "raffle",
}


export class BuyingOption {

    private option: string;

    public constructor(option=buyingOption.INSTANT) {
        if(!(option === buyingOption.BID || option === buyingOption.INSTANT || option === buyingOption.BID || option === buyingOption.RAFFLE)){
            throw 'Received invalid buying option ' + option;
        }
        this.option = option;
    }

}