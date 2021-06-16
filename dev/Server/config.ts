import dotenv from 'dotenv';
import checkState from "./src/ServiceLayer/state/CheckState";
import state from './src/ServiceLayer/state/MyInitialState';


//server configurations:

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3333;


const SERVER =
{
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
}

const Config =
{
    server: SERVER
}

export default Config;


//program constants
export const CHECKOUT_TIMEOUT = 3000000;     //5 minutes
export const CACHE_SIZE = -1;               //how much memory we want to cache (in bytes?)

//init configurations
export const SHOULD_RESET_DATABASE = true //delete all tables if exists and add system managers
export const SHOULD_INIT_STATE = true;    //initialize state from file?
export const INITIAL_STATE = state;


//API configurations
export const PAYMENT_SYSTEM_URL = 'https://cs-bgu-wsep.herokuapp.com/';
export const SUPPLY_SYSTEM_URL = 'https://cs-bgu-wsep.herokuapp.com/';


//Test Configurations
export const TEST_CHECKOUT_TIMEOUT = 200000 //100;//100 ms


export var PATH_TO_SYSTEM_MANAGERS = 'src/systemManagers.json';


/************* FUNCTIONS FOR TESTING PURPOSES ONLY *********** */
export const setPathToSystemManagers = (newPath:string) =>{
    PATH_TO_SYSTEM_MANAGERS = newPath;
}


export const TEST_MODE = true;
//database configurations:

    //modes:
const LOCALHOST_MODE = 1;
const REMOTE_MODE = 2;
const TEST_DB = 3;
const LOCALHOST_MACOS = 4;
    //end modes


export var sqlMode = TEST_DB;


class SqlConnector
{
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: string;
    port: number;

    static factory(): SqlConnector
    {
        let connector = new SqlConnector();
        if(sqlMode === REMOTE_MODE)
        {
            connector.username= 'T0fWZ940xw'
            connector.password= 'ppAkeHJWsg'
            connector.database= 'T0fWZ940xw'
            connector.host= 'remotemysql.com'
            connector.dialect= 'mysql'
            connector.port= 3306
        }
        else if(sqlMode === LOCALHOST_MACOS)
        {
            connector.username= 'root'
            connector.password= ''
            connector.database= 'db'
            connector.host= 'localhost'
            connector.dialect= 'mysql'
            connector.port= 3306
        }
        else if(sqlMode === TEST_DB)
        {
            connector.username= 'root'
            connector.password= '1234'
            connector.database= 'test_db'
            connector.host= 'localhost'
            connector.dialect= 'mysql'
            connector.port= 3306
        }
        else (sqlMode === LOCALHOST_MODE)
        {
            connector.username= 'root'
            connector.password= '1234'
            connector.database= 'db'
            connector.host= 'localhost'
            connector.dialect= 'mysql'
            connector.port= 3306
        }
        return connector;
    }
}
export const SQLconnector = SqlConnector.factory();

// cache configutaions:
export const SHOULD_USE_CACHE = true;

export const SUBSCRIBERS_CACHE_SIZE = 100
export const STORE_CACHE_SIZE = 100
export const PRODUCT_CACHE_SIZE = 200
export const TRANSACTIONS_CACHE_SIZE = 200

