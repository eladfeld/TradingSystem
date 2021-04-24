import { makeFailure, makeOk, Result } from "../../Result";


export enum buyingOption{
    INSTANT = 0,
    OFFER   = 1,
    BID     = 2,
    RAFFLE  = 3,
}