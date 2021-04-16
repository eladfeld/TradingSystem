import { makeFailure, makeOk, Result } from "../../Result";

export enum discountOption {
    VISIBLE     = 1,
    CONDITIONAL = 2,
    HIDDEN      = 3,
}

export class DiscountOption {

    private option: discountOption;
    private dateFrom: Date
    private dateUntil: Date
    private percent: number

    public constructor(percent: number, dateFrom: Date, dateUntil: Date, option = discountOption.VISIBLE) {
        this.option = discountOption.VISIBLE;
        this.dateFrom = dateFrom;
        this.dateUntil = dateUntil;
        this.percent = percent;
    }

    public getOption() {
        return this.option
    }

    public getDateFrom() : Date {
        return this.dateFrom
    }

    public getDateUntil() : Date {
        return this.dateUntil
    }

    public getPercent() {
        return this.percent
    }

};