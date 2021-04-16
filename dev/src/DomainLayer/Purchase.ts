import { makeFailure, Result } from "../Result";
import { Store } from "./store/Store";
import { PaymentMeans, SupplyInfo } from "./user/User";

export class Purchase
{
    public static checkout(price : number, store : Store, paymentMeans : PaymentMeans, supplyInfo : SupplyInfo) : Result<string>
    {
        return makeFailure("not yet implemented");
    }
}
