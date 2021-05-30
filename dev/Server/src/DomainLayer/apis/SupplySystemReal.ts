import { request } from 'http';
import axios from 'axios';
import { tShippingInfo } from '../purchase/Purchase';



class SupplySystemReal {
    private static nextTransactionId: number = 10000;
    private static nextSessionId: number = 1;
    private static shouldSucceed: boolean = true;

    //initializes system. returns a session id or negative number on failure
    static init = async () => {
        var bodyFormData = new URLSearchParams();
        bodyFormData.append('action_type', 'handshake');
        const response = await axios({method: "post",
        url: `https://cs-bgu-wsep.herokuapp.com/`,
        data: bodyFormData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        //const response = await axios.post(`https://cs-bgu-wsep.herokuapp.com/`, {action_type: "handshake"});
        switch(response.data){
            case "OK":
                return SupplySystemReal.nextSessionId++;
            default:
                return -1;
        }   
    }



    //finalizes the shipping order with reservation id @reservationId
    static supply = async(shippingInfo : tShippingInfo) : Promise<number> => {
        var bodyFormData = new URLSearchParams();
        bodyFormData.append('action_type', 'supply');
        bodyFormData.append('name', shippingInfo.name)
        bodyFormData.append('address', shippingInfo.address)
        bodyFormData.append('city', shippingInfo.city)
        bodyFormData.append('country', shippingInfo.country)
        bodyFormData.append('zip',shippingInfo.zip.toString())
        const response = await axios({method: "post",
        url: `https://cs-bgu-wsep.herokuapp.com/`,
        data: bodyFormData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        console.log('supply response', response.data);
        
        //const response =await axios.post(`https://cs-bgu-wsep.herokuapp.com/`, {action_type: "supply", name: shippingInfo.name, address:shippingInfo.address, city:shippingInfo.city, country:shippingInfo.country, zip:shippingInfo.zip});
        switch(response.data){
            case "-1":
                return -1;
            default:
                return response.data;
        
        } 
    }

    static cancelSupply = async(transactionId:number) : Promise<boolean> => {
        var bodyFormData = new URLSearchParams();
        bodyFormData.append('action_type', 'cancel_supply');
        bodyFormData.append('transaction_id', transactionId.toString())
        const response = await axios({method: "post",
        url: `https://cs-bgu-wsep.herokuapp.com/`,
        data: bodyFormData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        //const response =await axios.post(`https://cs-bgu-wsep.herokuapp.com/`, {action_type: "cancel_supply", transaction_id: transactionId});
        switch(response.data){
            case "-1":
                return false;
            default:
                return true;
        
        } 
    }

}

export default SupplySystemReal;