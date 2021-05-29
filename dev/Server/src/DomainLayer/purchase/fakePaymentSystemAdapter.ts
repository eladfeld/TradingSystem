import { makeFailure, makeOk, Result } from "../../Result";
import PaymentSystem from "../apis/PaymentSystem";
import { PaymentInfo } from "./PaymentInfo";
import { tPaymentInfo } from "./Purchase";


class fakePaymentSystemAdapter {

    init = () : Result<number> => {
        const res: number = PaymentSystem.init();
        if(res<0)//failed to init
            return makeFailure(fakePaymentSystemAdapter.initResToMessage(res));
        return makeOk(res);
    }

    //returns a transaction number
    transfer = (paymentInfo:tPaymentInfo ):Result<number> => {
        const res: number =  PaymentSystem.transfer(paymentInfo);
        if(res<0) return makeFailure(fakePaymentSystemAdapter.transferResToMessage(res));
        return makeOk(res);
    }

    refund = (transactionNumber: number):boolean => {
        return PaymentSystem.refund(transactionNumber);
    }

    static transferResToMessage = (res: number):string =>{
        switch(res){
            default:
                return "Failed to transfer funds."
        }
    }

    static initResToMessage = (res: number):string =>{
        switch(res){
            default:
                return "Failed to init system."
        }
    }

}


export default fakePaymentSystemAdapter;