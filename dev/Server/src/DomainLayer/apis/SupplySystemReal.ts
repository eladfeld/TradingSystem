import { request } from 'http';
import axios from 'axios';
import ShippingInfo from '../purchase/ShippingInfo';



class SupplySystemReal {
    private static nextTransactionId: number = 10000;
    private static nextSessionId: number = 1;
    private static shouldSucceed: boolean = true;

    //initializes system. returns a session id or negative number on failure
    static init = async () => {
        const response = await axios.post(`https://cs-bgu-wsep.herokuapp.com/`, {action_type: "handshake"});
        switch(response.data){
            case "OK":
                return SupplySystemReal.nextSessionId++;
            default:
                return -1;
        }   
    }


    //reserves a shipment from @from to @to and @returns a unique shipment reservation number
    //this reservation number is needed for canceling and supplying the reservation
    /*static reserve = (from: string, to:string) : number => {
        return SupplySystem.shouldSucceed ? SupplySystem.nextReservationId++ : -1;
    }
    

    //cancels the shipping reservation with id @reservationId and @returns true if suceeded
    //after calling this function, calling cancel/supply for the same reservation id will fail and return false
    static cancelReservation = (reservationId: number) :boolean => {
        return SupplySystem.shouldSucceed ? true : false;
    }
    */

    //finalizes the shipping order with reservation id @reservationId
    static supply = async(shippingInfo : ShippingInfo) : Promise<number> => {
        const response =await axios.post(`https://cs-bgu-wsep.herokuapp.com/`, {action_type: "supply", name: shippingInfo.name, address:shippingInfo.address, city:shippingInfo.city, country:shippingInfo.country, zip:shippingInfo.zip});
        switch(response.data){
            case "-1":
                return -1;
            default:
                return response.data;
        
        } 
    }

    static cancelSupply = async(transactionId:number) : Promise<boolean> => {
        const response =await axios.post(`https://cs-bgu-wsep.herokuapp.com/`, {action_type: "cancel_supply", transaction_id: transactionId});
        switch(response.data){
            case "-1":
                return false;
            default:
                return true;
        
        } 
    }

    //static willSucceed = () => SupplySystem.shouldSucceed = true;
    //static willFail = () => SupplySystem.shouldSucceed = false;
}

export default SupplySystemReal;