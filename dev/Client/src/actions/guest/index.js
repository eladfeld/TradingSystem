import axios from 'axios';

export const GUEST_ACTION_TYPES = {
    ENTER: "ENTER",
    REGISTER: "REGISTER",
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    ADD_TO_CART: "ADD_TO_CART",
    REMOVE_FROM_CART: "REMOVE_FROM_CART"
};

export const enter = () => {
    return async (dispatch) => {
        const response = await axios.get('http://192.168.56.1:3333/command/enter');
        if(response.status === 200){
            dispatch({
                type: GUEST_ACTION_TYPES.ENTER,
                payload: response.data.userId
            });
        }
    };
}

export const register = async (userName, password) => {
    console.log(`register with ${userName}, ${password}`);
    const response = await axios.post('http://192.168.56.1:3333/command/register', {userName, password} );
    if(response.status === 200){
        alert(response.data.message);
    }
    else alert(response.data.error);
};


/////////
export const login = (userId, username, password) => {
    console.log(`login with ${userId}, ${username}, ${password}`);
    return async (dispatch) => {
        const response = await axios.post('http://192.168.56.1:3333/command/login', {userId, username, password} )
        if(response.status === 200){
            dispatch({
                type: GUEST_ACTION_TYPES.LOGIN,
                payload: response.data.userId
            });
        }
        else alert(response.data.error);
    };
}

export const login2 = (username, password) => {

    return {
        type: GUEST_ACTION_TYPES.LOGIN,
        payload: {username, password}
    };
}

export const addToCart = (store, product, quantity) => {
    return {
        type: GUEST_ACTION_TYPES.ADD_TO_CART,
        payload: {store, product, quantity}
    };
}

export const removeFromCart = (storeId, productId, quantity, productDetails) => {
    console.log(`[action] remove sid: ${storeId} pid: ${productId}`);
    return {
        type: GUEST_ACTION_TYPES.REMOVE_FROM_CART,
        payload: {storeId, productId, quantity, productDetails}
    };
}