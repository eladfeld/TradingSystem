import { makeOk, Result } from '../../Result';
import {ShoppingCart} from '../user/ShoppingCart';
import ShippingInfo from './ShippingInfo';

class SupplySystemAdapter {
    constructor(){

    }

    supply = (reservationId: number) : boolean => {
        return true;
    }

    reserve = (shippingInfo: ShippingInfo) : number => {
        return 0;
    }

    cancelReservation = (reservationId: number) :boolean => {
        return true;
    }
}

export default SupplySystemAdapter;