import { request } from 'http';
import axios from 'axios';
import { tPaymentInfo } from '../purchase/Purchase';



class PaymentSystemReal {

    private static nextSessionId: number = 1;

    //initializes system. returns a session id or negative number on failure
    static init = async() : Promise<number> => {
        const response =await axios.post(`https://cs-bgu-wsep.herokuapp.com/`, {action_type: "handshake"});
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
        const response = await axios.post(`https://cs-bgu-wsep.herokuapp.com/`, {action_type: "pay", card_number: paymentInfo.cardNumber, month: paymentInfo.expMonth, year: paymentInfo.expYear,holder: paymentInfo.holder, ccv: paymentInfo.cvv, id: paymentInfo.id});
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
        const response = await axios.post(`https://cs-bgu-wsep.herokuapp.com/`, {action_type: "cancel_pay", transaction_id: paymentId});
        switch(response.data){
            case "-1":
                return false;
            default:
                return true; 
            }
    }

}

export default PaymentSystemReal;
