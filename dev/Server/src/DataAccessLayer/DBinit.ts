import { TEST_MODE } from "../config";
import { StoreDummyDB } from "./dummies/StoreDummyDB";
import { iStoreDB } from "./interfaces/iStoreDB";
import { iSubscriberDB } from "./interfaces/iSubscriberDB";
import { SubscriberDummyDB } from "./dummies/SubscriberDummyDb";
import { iPurchaseDB } from "./interfaces/iPurchaseDB";
import { PurchaseDummyDB } from "./dummies/PurchaseDummyDB";
import { ProductDummyDB } from "./dummies/ProductDummyDB";
import { iProductDB } from "./interfaces/iProductDB";
import { SubscriberDB } from "./dbs/SubscriberDB";
import { iLoginStatsDB } from "./interfaces/iLoginStatsDB";
import { LoginStatsDummyDB } from "./dummies/LoginStatsDummyDB";


const initSubscriberDB = () : iSubscriberDB => {
    if (TEST_MODE)
        // TODO: change it to test db
        return new SubscriberDummyDB()
    else
        return new SubscriberDB()
} 

const initStoreDB = () : iStoreDB => {
    if (TEST_MODE)
    // TODO: change it to test db
        return new StoreDummyDB()
    else
        return new StoreDummyDB()
}

const initPurchaseDB = () : iPurchaseDB => {
    if (TEST_MODE)
    // TODO: change it to test db
        return new PurchaseDummyDB();
    else
        return new PurchaseDummyDB();
}

const initProductDB = () : iProductDB =>
{
    if (TEST_MODE)
    // TODO: change it to test db
        return new ProductDummyDB();
    else
        return new ProductDummyDB();
}

const initLoginStatsDB = () : iLoginStatsDB =>
{
    if (TEST_MODE)
    // TODO: change it to test db
        return new LoginStatsDummyDB();
    else
        return new LoginStatsDummyDB();
}

export const subscriberDB = initSubscriberDB();
export const StoreDB = initStoreDB();
export const PurchaseDB = initPurchaseDB();
export const ProductDB = initProductDB();
export const loginStatsDB = initLoginStatsDB();

export default {subscriberDB, StoreDB , PurchaseDB, loginStatsDB};
