import { makeOk, Result } from '../../Result';
import SupplySystem from '../apis/SupplySystem';
import {ShoppingCart} from '../user/ShoppingCart';
import ShippingInfo from './ShippingInfo';

class SupplySystemAdapter {
    constructor(){

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
}

export default SupplySystemAdapter;