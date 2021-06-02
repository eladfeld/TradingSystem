import SupplySystem from "./DomainLayer/apis/SupplySystem";
import PaymentSystemAdapter from "./DomainLayer/purchase/PaymentSystemAdapter";
import SupplySystemAdapter from "./DomainLayer/purchase/SupplySystemAdapter";
import state from "./ServiceLayer/state/MyInitialState";
import checkState from "./ServiceLayer/state/CheckState";
import fakePaymentSystemAdapter from "./DomainLayer/purchase/fakePaymentSystemAdapter";
import fakeSupplySystemAdapter from "./DomainLayer/purchase/fakeSupplySystemAdapter";
import { iPaymentAdapter, iSupplyAdapter } from "./DomainLayer/purchase/iAPI";

export var TEST_MODE = false;


//program constants
export const CHECKOUT_TIMEOUT = 3000000;//5 minutes
export const CACHE_SIZE = -1;           //how much memory we want to cache (in bytes?)

//init configurations
export const SHOULD_INIT_STATE = true;    //initialize state from file?
export const INITIAL_STATE = checkState;


//API configurations
export const PAYMENT_SYSTEM_URL = 'https://cs-bgu-wsep.herokuapp.com/';
export const SUPPLY_SYSTEM_URL = 'https://cs-bgu-wsep.herokuapp.com/';

//Database configurations

//Test Configurations
export const TEST_CHECKOUT_TIMEOUT = 200000 //100;//100 ms

//


export var PATH_TO_SYSTEM_MANAGERS = 'src/systemManagers.json';


/************* FUNCTIONS FOR TESTING PURPOSES ONLY *********** */
export const setPathToSystemManagers = (newPath:string) =>{ 
    PATH_TO_SYSTEM_MANAGERS = newPath;
}
