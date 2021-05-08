export const initialAppState = {
    userId: 0,
    userName: 'Guest',
    basketAtCheckout: undefined,
    cart: undefined,
    myTransactions: undefined,
    stores: []
};

export const unknownStatusMessage = (res) =>{
    return `unknown response code ${res.status}`;
}