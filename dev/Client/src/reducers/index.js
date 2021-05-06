import {combineReducers} from 'redux';

import {GUEST_ACTION_TYPES} from '../actions/guest';

//import {fakeCart} from '../../../../client/src/components/fakes';
import { SUBSCRIBER_ACTION_TYPES } from '../actions/subscriber';

const currentUserReducer = (userId = 0, action) => {
    switch (action.type) {
        case GUEST_ACTION_TYPES.ENTER:
            return action.payload;
        case GUEST_ACTION_TYPES.LOGIN:
            return action.payload;
        case SUBSCRIBER_ACTION_TYPES.LOGOUT:
            return 0;
        default:
            return userId;
    }
};

//TODO: just update quantities if item already present
//currently adds duplicates and removes entirely
const cartReducer = (cart=[], action) => {
    console.log('reducing...');
    const pl = action.payload;
    switch (action.type) {
        case GUEST_ACTION_TYPES.ADD_TO_CART:            
            return [...cart, action.payload]; 
        case GUEST_ACTION_TYPES.REMOVE_FROM_CART:
            console.log(`[reducer] sid: ${pl.storeId}`);
            return cart.filter(basket => basket.storeId !== pl.storeId);
        default:
            return cart;
    }
};
export default combineReducers({
    userId: currentUserReducer,
    cart: cartReducer
});