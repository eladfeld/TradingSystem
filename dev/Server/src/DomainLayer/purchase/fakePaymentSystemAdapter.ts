import { makeFailure, makeOk, Result } from "../../Result";
import PaymentSystem from "../apis/PaymentSystem";
import { iPaymentAdapter } from "./iAPI";
import { PaymentInfo } from "./PaymentInfo";
import { tPaymentInfo } from "./Purchase";


class fakePaymentSystemAdapter implements iPaymentAdapter{

    init = () : Promise<number> => {
        const res: number = PaymentSystem.init();
        return Promise.resolve(res);
    }

    //returns a transaction number
    transfer = (paymentInfo:tPaymentInfo ):Promise<number> => {
        const res: number =  PaymentSystem.transfer(paymentInfo);
        return Promise.resolve(res)
    }

    refund = (transactionNumber: number):Promise<boolean> => {
        const res: boolean = PaymentSystem.refund(transactionNumber);
        return Promise.resolve(res);
    }


}


export default fakePaymentSystemAdapter;