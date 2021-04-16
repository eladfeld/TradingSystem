import { makeOk, Result } from "../../Result";

class PaymentSystem {


    //returns a transaction number
    static transfer = (cardNumber:number, expiration:number, cvv:number, toAccount: number, amount: number ):number => {
        return 0;
    }

    static refund = (transactionNumber: number):boolean => {
        return false;
    }

}

export default PaymentSystem;