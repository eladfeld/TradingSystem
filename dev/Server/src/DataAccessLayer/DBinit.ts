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
import { StoreDB } from "./dbs/StoreDB";
import { ProductDB } from "./dbs/ProductDB";


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
        return new StoreDB()
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
        return new ProductDB();
}

export const subscriberDB = initSubscriberDB();
export const storeDB = initStoreDB();
export const purchaseDB = initPurchaseDB();
export const productDB = initProductDB();

export default {subscriberDB, StoreDB , PurchaseDB: purchaseDB};
