import { makeFailure, makeOk, Result } from '../../Result';
import SupplySystem from '../apis/SupplySystem';
import SupplySystemReal from '../apis/SupplySystemReal';
import {ShoppingCart} from '../user/ShoppingCart';
import { tShippingInfo } from './Purchase';
import ShippingInfo from './ShippingInfo';

class SupplySystemAdapter {

    init = () : Promise<number> => {
        return SupplySystemReal.init();
    }

    supply = (shippingInfo: tShippingInfo) : Promise<number> => {
        return SupplySystemReal.supply(shippingInfo);
    }

    cancelSupply = (transId: number) :Promise<boolean> => {
        return SupplySystemReal.cancelSupply(transId);
    }

}

export default SupplySystemAdapter;