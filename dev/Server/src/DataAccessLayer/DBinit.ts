import { TEST_MODE } from "../config";
import { StoreDummyDB } from "../DomainLayer/store/StoreDummyDB";
import { iStoreDB } from "./interfaces/iStoreDB";
import { iSubscriberDB } from "./interfaces/iSubscriberDB";
import { SubscriberDummyDB } from "./SubscriberDummyDb";
import { iPurchaseDB } from "./interfaces/iPurchaseDB";
import { PurchaseDummyDB } from "../DomainLayer/purchase/PurchaseDummyDB";


const initSubscriberDB = () : iSubscriberDB => {
    if (TEST_MODE)
        // TODO: change it to test db
        return new SubscriberDummyDB()
    else
        return new SubscriberDummyDB()
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

export const subscriberDB = initSubscriberDB();
export const StoreDB = initStoreDB();
export const PurchaseDB = initPurchaseDB();

export default {subscriberDB, StoreDB , PurchaseDB};
