import { makeFailure, makeOk, Result } from '../../Result';
import SupplySystem from '../apis/SupplySystem';
import SupplySystemReal from '../apis/SupplySystemReal';
import {ShoppingCart} from '../user/ShoppingCart';
import { tShippingInfo } from './Purchase';
import ShippingInfo from './ShippingInfo';

class SupplySystemAdapter {

    init = async () : Promise<Result<number>> => {
        const res: number = await SupplySystemReal.init();
        if(res < 0)           //failed to init
            return makeFailure(SupplySystemAdapter.initResToMessage(res));
        return makeOk(res);
    }

    supply = async (shippingInfo: tShippingInfo) : Promise<number> => {
        return await SupplySystemReal.supply(shippingInfo);
    }

    /*reserve = (shippingInfo: ShippingInfo) : number => {
        return SupplySystem.reserve(shippingInfo.to, shippingInfo.from);
    }
    */
    

    cancelSupply = async (transId: number) :Promise<boolean> => {
        return await SupplySystemReal.cancelSupply(transId);
    }

    static initResToMessage = (res: number):string =>{
        switch(res){
            default:
                return "Failed to init system."
        }
    }
}

export default SupplySystemAdapter;