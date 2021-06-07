import { makeFailure, makeOk, Result } from '../../Result';
import SupplySystem from '../apis/SupplySystem';
import {ShoppingCart} from '../user/ShoppingCart';
import ShippingInfo from './ShippingInfo';
import { tShippingInfo } from "./Purchase";
import { iSupplyAdapter } from './iAPI';


class fakeSupplySystemAdapter implements iSupplyAdapter{

    init = () : Promise<number> => {
        const res: number = SupplySystem.init();
        return Promise.resolve(res);
    }

    supply = (shippingInfo: tShippingInfo) : Promise<number> => {
        const res: number = SupplySystem.supply(shippingInfo);
        return Promise.resolve(res);
    }


    cancelSupply = (reservationId: number) :Promise<boolean> => {
        const res = SupplySystem.cancel(reservationId);
        return Promise.resolve(res);
    }
}

export default fakeSupplySystemAdapter;