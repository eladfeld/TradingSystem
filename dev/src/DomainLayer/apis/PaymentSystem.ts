import { makeOk, Result } from "../../Result";

class PaymentSystem {

    private static nextPaymentId: number = 1;

    //transfers @amount dollars to bank account number @toAccount
    //from credit card with number @cardNumber, expires at DD/MM/YYYY where @expiration=DDMMYYYY, and cvv of @cvv
    //returns the unique payment number necesary for referencing the payment and refunding
    static transfer = (cardNumber:number, expiration:number, cvv:number, toAccount: number, amount: number ):number => {
        return PaymentSystem.nextPaymentId++;
    }

    //refunds the credit charge with payment id of @paymentId
    //returns negative number if refund not possible
    static refund = (paymentId: number):boolean => {
        return true;
    }

}

export default PaymentSystem;