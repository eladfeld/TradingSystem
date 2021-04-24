import {combineReducers} from 'redux';

import {ACTION_TYPES} from '../actions/guest';

import {fakeCart} from '../components/fakes';

const loginReducer = (userId = 0, action) => {
    switch (action.type) {
        case ACTION_TYPES.LOGIN:
            return action.payload;    
        default:
            return userId;
    }
};

//TODO: just update quantities if item already present
//currently adds duplicates and removes entirely
const cartReducer = (cart=fakeCart(), action) => {
    console.log('reducing...');
    const pl = action.payload;
    switch (action.type) {
        case ACTION_TYPES.ADD_TO_CART:            
            return [...cart, action.payload]; 
        case ACTION_TYPES.REMOVE_FROM_CART:
            console.log(`[reducer] sid: ${pl.storeId}`);
            return cart.filter(basket => basket.storeId !== pl.storeId);
        default:
            return cart;
    }
};
export default combineReducers({
    login: loginReducer,
    cart: cartReducer
});