import { makeFailure, makeOk, Result } from "../../Result";
import PaymentSystem from "../apis/PaymentSystem";

class PaymentSystemAdapter {


    //returns a transaction number
    transfer = (from: PaymentInfo, to: number, amount: number ):Result<number> => {
        const res: number =  PaymentSystem.transfer(from.getCardNumber(), from.getExpiration(), from.getCvv(), to, amount);
        if(res<0) return makeFailure(PaymentSystemAdapter.transferResToMessage(res));
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

}


export default PaymentSystemAdapter;