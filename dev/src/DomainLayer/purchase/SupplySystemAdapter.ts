import { makeFailure, makeOk, Result } from '../../Result';
import SupplySystem from '../apis/SupplySystem';
import {ShoppingCart} from '../user/ShoppingCart';
import ShippingInfo from './ShippingInfo';

class SupplySystemAdapter {

    init = () : Result<number> => {
        const res: number = SupplySystem.init();
        if(res<0)//failed to init
            return makeFailure(SupplySystemAdapter.initResToMessage(res));
        return makeOk(res);
    }

    supply = (reservationId: number) : boolean => {
        return SupplySystem.supply(reservationId);
    }

    reserve = (shippingInfo: ShippingInfo) : number => {
        return SupplySystem.reserve(shippingInfo.storeAddress, shippingInfo.userAddress);
    }

    cancelReservation = (reservationId: number) :boolean => {
        return SupplySystem.cancelReservation(reservationId);
    }

    static initResToMessage = (res: number):string =>{
        switch(res){
            default:
                return "Failed to init system."
        }
    }
}

export default SupplySystemAdapter;