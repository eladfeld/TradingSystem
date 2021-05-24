import { makeFailure, makeOk, Result } from "../../Result";
import PaymentSystem from "../apis/PaymentSystem";
import PaymentSystemReal from "../apis/PaymentSystemReal";
import { PaymentInfo } from "./PaymentInfo";
import { tPaymentInfo } from "./Purchase";

class PaymentSystemAdapter {

    init = () : Result<number> => {
        const res: number = PaymentSystem.init();
        if(res<0)//failed to init
            return makeFailure(PaymentSystemAdapter.initResToMessage(res));
        return makeOk(res);
    }

    //returns a transaction number
    transfer = async (paymentInfo: tPaymentInfo ):Promise<Result<number>> => {
        const res: number = await PaymentSystemReal.transfer(paymentInfo);
        if(res<0) 
            return makeFailure(PaymentSystemAdapter.transferResToMessage(res));
        return makeOk(res);
    }

    refund = async (transactionNumber: number):Promise<boolean> => {
        return await PaymentSystemReal.refund(transactionNumber);
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


export default PaymentSystemAdapter;