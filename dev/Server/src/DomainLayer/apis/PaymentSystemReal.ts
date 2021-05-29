import { request } from 'http';
import axios from 'axios';
import { tPaymentInfo } from '../purchase/Purchase';
import { URLSearchParams } from "url"



class PaymentSystemReal {

    private static nextSessionId: number = 1;

    //initializes system. returns a session id or negative number on failure
    static init = async() : Promise<number> => {
        var bodyFormData = new URLSearchParams();
        bodyFormData.append('action_type', 'handshake');
        const response = await axios({method: "post",
        url: `https://cs-bgu-wsep.herokuapp.com/`,
        data: bodyFormData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        //const response =await axios.post(`https://cs-bgu-wsep.herokuapp.com/`, {action_type: "handshake"});
        switch(response.data){
            case "OK":
                return PaymentSystemReal.nextSessionId++;
            default:
                return -1;
        
        }   
    }

    
    //check response code status and if contains any data, no magic numbers
    //transfers @amount dollars to bank account number @toAccount
    //from credit card with number @cardNumber, expires at DD/MM/YYYY where @expiration=DDMMYYYY, and cvv of @cvv
    //returns the unique payment number necesary for referencing the payment and refunding or negative numbr on failure
    static transfer = async(paymentInfo: tPaymentInfo):Promise<number> => {
        var bodyFormData = new URLSearchParams();
        bodyFormData.append('action_type', 'pay');
        bodyFormData.append('card_number', paymentInfo.cardNumber.toString())
        bodyFormData.append('month', paymentInfo.expMonth.toString())
        bodyFormData.append('year', paymentInfo.expYear.toString())
        bodyFormData.append('holder', paymentInfo.holder)
        bodyFormData.append('ccv', paymentInfo.cvv.toString())
        bodyFormData.append('id', paymentInfo.id.toString())
        const response = await axios({method: "post",
        url: `https://cs-bgu-wsep.herokuapp.com/`,
        data: bodyFormData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        switch(response.data){
            case "-1":
                return -1;
            default:
                return response.data; 
            }
    }

    //refunds the credit charge with payment id of @paymentId
    //returns negative number if refund not possible
    static refund = async(paymentId: number):Promise<boolean> => {
        var bodyFormData = new URLSearchParams();
        bodyFormData.append('action_type', 'cancel_pay');
        bodyFormData.append('transaction_id', paymentId.toString())
        const response = await axios({method: "post",
        url: `https://cs-bgu-wsep.herokuapp.com/`,
        data: bodyFormData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        //const response = await axios.post(`https://cs-bgu-wsep.herokuapp.com/`, {action_type: "cancel_pay", transaction_id: paymentId});
        switch(response.data){
            case "-1":
                return false;
            default:
                return true; 
            }
    }

}

export default PaymentSystemReal;
