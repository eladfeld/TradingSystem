import { makeFailure, makeOk, Result } from "../../Result";
import PaymentSystem from "../apis/PaymentSystem";
import PaymentSystemReal from "../apis/PaymentSystemReal";
import { iPaymentAdapter } from "./iAPI";
import { tPaymentInfo } from "./Purchase";

class PaymentSystemAdapter implements iPaymentAdapter {


    init = () : Promise<number> => {
        return PaymentSystemReal.init();
    }

    //returns a transaction number
    transfer = (paymentInfo: tPaymentInfo ):Promise<number> => {
        return PaymentSystemReal.transfer(paymentInfo);
    }

    refund =(transactionNumber: number):Promise<boolean> => {
        return  PaymentSystemReal.refund(transactionNumber);
    }

}


export default PaymentSystemAdapter;