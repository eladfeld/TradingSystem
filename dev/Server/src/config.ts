import SupplySystem from "./DomainLayer/apis/SupplySystem";
import PaymentSystemAdapter from "./DomainLayer/purchase/PaymentSystemAdapter";
import SupplySystemAdapter from "./DomainLayer/purchase/SupplySystemAdapter";
import state from "./ServiceLayer/state/MyInitialState";

export const setTestConfigurations = () => {
    CHECKOUT_TIMEOUT = 100;
    PAYMENT_SYSTEM = undefined;
    SUPPLY_SYSTEM = undefined;
    SHOULD_INIT_STATE = false;
}

export const setSystemConfigurations = () => {
    CHECKOUT_TIMEOUT = 3000000;
    PAYMENT_SYSTEM = undefined;
    SUPPLY_SYSTEM = undefined;
}

//program constants
export var CHECKOUT_TIMEOUT = 3000000;//5 minutes
export const CACHE_SIZE = -1;           //how much memory we want to cache (in bytes?)

//init configurations
export var SHOULD_INIT_STATE = true;    //initialize state from file?
export const INITIAL_STATE = state;


//API configurations
export var PAYMENT_SYSTEM:PaymentSystemAdapter = undefined;
export var SUPPLY_SYSTEM:SupplySystemAdapter = undefined;
export const PAYMENT_SYSTEM_URL = 'https://cs-bgu-wsep.herokuapp.com/';
export const SUPPLY_SYSTEM_URL = 'https://cs-bgu-wsep.herokuapp.com/';

//Database configurations

//
