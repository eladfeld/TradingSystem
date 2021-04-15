import {ShoppingCart} from '../user/ShoppingCart';

class SupplySystemAdapter {
    constructor(){

    }

    supply = (userInfo: string, cart: ShoppingCart) : boolean=> {
        return false;
    }

    reserve = (cart: Map<number,Map<number, number>>) : boolean => {
        return false;
    }

    cancelReservation = (cart: Map<number,Map<number, number>>) :boolean => {
        return false;
    }

    updateReservation = (oldCart:Map<number,Map<number, number>>, newCart:Map<number,Map<number, number>>): boolean =>{
        return false;
    }
}

export default SupplySystemAdapter;