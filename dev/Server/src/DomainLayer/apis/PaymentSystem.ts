import { tPaymentInfo } from "../purchase/Purchase";

class PaymentSystem {

    private static nextPaymentId: number = 1;
    private static nextSessionId: number = 1;
    private static shouldSucceed: boolean = true;
    //public  static ERROR: number = -500;

    //initializes system. returns a session id or negative number on failure
    static init = () : number => {
        return PaymentSystem.shouldSucceed ? PaymentSystem.nextSessionId++ : -1;
    }

    //transfers @amount dollars to bank account number @toAccount
    //from credit card with number @cardNumber, expires at DD/MM/YYYY where @expiration=DDMMYYYY, and cvv of @cvv
    //returns the unique payment number necesary for referencing the payment and refunding or negative numbr on failure
    static transfer = (paymentInfo: tPaymentInfo):number => {
        return PaymentSystem.shouldSucceed ? PaymentSystem.nextPaymentId++ : -1;
    }

    //refunds the credit charge with payment id of @paymentId
    //returns negative number if refund not possible
    static refund = (paymentId: number):boolean => {
        return PaymentSystem.shouldSucceed ? true : false;
    }

    
    static willFail = () => PaymentSystem.shouldSucceed = false;
    static willSucceed = () => PaymentSystem.shouldSucceed = true;


}

export default PaymentSystem;