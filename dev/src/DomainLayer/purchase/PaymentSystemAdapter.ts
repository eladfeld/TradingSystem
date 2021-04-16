import { makeOk, Result } from "../../Result";

class PaymentSystemAdapter {


    //returns a transaction number
    transfer = (from: PaymentInfo, to: number, amount: number ):Result<number> => {
        return makeOk(0)
    }

    refund = (transactionNumber: number):boolean => {
        return false;
    }

}

export default PaymentSystemAdapter;