export const ACTION_TYPES = {
    LOGIN: "LOGIN",
    ADD_TO_CART: "ADD_TO_CART",
    REMOVE_FROM_CART: "REMOVE_FROM_CART"
};

export const login = (username, password) => {
    return {
        type: ACTION_TYPES.LOGIN,
        payload: {username, password}
    };
}

export const addToCart = (store, product, quantity) => {
    return {
        type: ACTION_TYPES.ADD_TO_CART,
        payload: {store, product, quantity}
    };
}

export const removeFromCart = (storeId, productId, quantity, productDetails) => {
    console.log(`[action] remove sid: ${storeId} pid: ${productId}`);
    return {
        type: ACTION_TYPES.REMOVE_FROM_CART,
        payload: {storeId, productId, quantity, productDetails}
    };
}