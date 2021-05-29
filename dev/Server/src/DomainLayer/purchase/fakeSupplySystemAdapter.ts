import { makeFailure, makeOk, Result } from '../../Result';
import SupplySystem from '../apis/SupplySystem';
import {ShoppingCart} from '../user/ShoppingCart';
import ShippingInfo from './ShippingInfo';
import { tShippingInfo } from "./Purchase";


class fakeSupplySystemAdapter {

    init = () : Result<number> => {
        const res: number = SupplySystem.init();
        if(res<0)//failed to init
            return makeFailure(fakeSupplySystemAdapter.initResToMessage(res));
        return makeOk(res);
    }

    supply = (reservationId: number) : boolean => {
        return SupplySystem.supply(reservationId);
    }

    reserve = (shippingInfo: tShippingInfo) : number => {
        return SupplySystem.reserve(shippingInfo);
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

export default fakeSupplySystemAdapter;