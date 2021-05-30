import { TEST_MODE } from "../../config"
import fakePaymentSystemAdapter from "../purchase/fakePaymentSystemAdapter";
import fakeSupplySystemAdapter from "../purchase/fakeSupplySystemAdapter"
import { iPaymentAdapter, iSupplyAdapter } from "../purchase/iAPI"
import PaymentSystemAdapter from "../purchase/PaymentSystemAdapter";
import SupplySystemAdapter from "../purchase/SupplySystemAdapter";

class APIAdapterFactory{
    
    public static getSupplyAdapter = ():iSupplyAdapter =>{
        if(TEST_MODE)
            return new fakeSupplySystemAdapter();
        return new SupplySystemAdapter();
    }

    public static getPaymentAdapter = ():iPaymentAdapter =>{
        if(TEST_MODE)
            return new fakePaymentSystemAdapter();
        return new PaymentSystemAdapter();
    }
}