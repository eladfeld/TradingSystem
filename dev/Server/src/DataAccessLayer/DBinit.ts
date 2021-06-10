import { TEST_MODE } from "../../config";
import { StoreDummyDB } from "./dummies/StoreDummyDB";
import { iStoreDB } from "./interfaces/iStoreDB";
import { iSubscriberDB } from "./interfaces/iSubscriberDB";
import { SubscriberDummyDB } from "./dummies/SubscriberDummyDb";
import { iPurchaseDB } from "./interfaces/iPurchaseDB";
import { PurchaseDummyDB } from "./dummies/PurchaseDummyDB";
import { ProductDummyDB } from "./dummies/ProductDummyDB";
import { iProductDB } from "./interfaces/iProductDB";
import { subscriberDB } from "./dbs/SubscriberDB";
import { storeDB } from "./dbs/StoreDB";
import { productDB } from "./dbs/ProductDB";
import { purchaseDB } from "./dbs/PurchaseDB";


const initSubscriberDB = () : iSubscriberDB => {
    if (TEST_MODE)
        return new SubscriberDummyDB();
    else
        return new subscriberDB();
} 

const initStoreDB = () : iStoreDB => {
    if (TEST_MODE)
    // TODO: change it to test db
        return new StoreDummyDB();
    else
        return new storeDB() ;
}

const initPurchaseDB = () : iPurchaseDB => {
    if (TEST_MODE)
    // TODO: change it to test db
        return new PurchaseDummyDB();
    else
        return new purchaseDB();
}

const initProductDB = () : iProductDB =>
{
    if (TEST_MODE)
    // TODO: change it to test db
        return new ProductDummyDB();
    else
        return new productDB();
}

export const SubscriberDB = initSubscriberDB();
export const StoreDB = initStoreDB();
export const PurchaseDB = initPurchaseDB();
export const ProductDB = initProductDB();

export default {subscriberDB, StoreDB , PurchaseDB};
