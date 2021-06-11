import { makeFailure, makeOk, Result } from "../../Result";
import { ID } from "./Common";

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
    private id: number

    public constructor(percent: number, dateFrom: Date, dateUntil: Date, option = discountOption.VISIBLE) {
        this.id = ID();
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

    public getId() {
        return this.id
    }

};