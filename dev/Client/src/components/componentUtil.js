export const initialAppState = {
    userId: 0,
    userName: 'Guest',
    basketAtCheckout: undefined,
    cart: undefined,
    myTransactions: undefined,
    stores: [],
    storeInventory: undefined,
    staffToView: undefined,
    wsConn: undefined
};

export const unknownStatusMessage = (res) =>{
    return `unknown response code ${res.status}`;
}

export const isNonNegativeInteger = (str) =>{
    if(str.length === 0)return false;
    for(var i=0; i<str.length; i++){
      const c = str.charAt(i);
      if(c>"9" || c<"0")
        return false;
    }
    return true;
}

export const areNonNegativeIntegers = (strs) =>{
    return (strs.map(s => isNonNegativeInteger(s)).find(b => b===false) === undefined);
}