import StateBuilder, { PRODUCT_PREF, storeItemState, storeState, systemState, transactionState } from '../../../src/ServiceLayer/state/StateBuilder';

const NUM_USERS = 10000;
const NUM_STORES = 1000;
const NUM_PRODUCTS_PER_STORE = 1000;
const NUM_TRANSACTIONS = 1000000;

const NUM_GUESTS = NUM_USERS * 0.6;
const NUM_SUBSCRIBERS = NUM_USERS * 0.35;
const NUM_STORE_MANAGERS = NUM_USERS * 0.04;
const NUM_STORE_OWNERS = NUM_USERS * 0.01;

const empty: transactionState[] = [];
const sb: StateBuilder = new StateBuilder();

const generate_inventory = (ownerIdx:number, storeIdx:number):storeItemState[]=>{
    const output:storeItemState[] = [];
    for(var i=0; i<NUM_PRODUCTS_PER_STORE; i++){
        output.push(sb.storeItem(`product_${ownerIdx}_${storeIdx}_${i}`,[],1,100000000));
    }
    return output;
}

const state:systemState = {
    stores:[],
    subscribers:[],
    history:[]
};

const USERNAME_PREFIX = 'user_sl2_';
const STORENAME_PREFIX = 'store_sl2_'

//10000 subscribers
for(var i=0; i<NUM_USERS; i++){
    state.subscribers.push(sb.subscriber(`${USERNAME_PREFIX}${i}`));
}

//1000 stores with 1000 products each
var managerIdx = NUM_STORE_OWNERS;
for(var ownerIdx=0; ownerIdx<NUM_STORE_OWNERS; ownerIdx++){
    for(var storeIdx=0; storeIdx<10; storeIdx++){
        const store: storeState = {
            name:`${STORENAME_PREFIX}${ownerIdx}_${storeIdx}`,
            founder:`${USERNAME_PREFIX}${ownerIdx}`,
            categories: [],
            inventory:generate_inventory(ownerIdx,storeIdx),
            employees:{
                owners:[],
                managers:[sb.manager(`${USERNAME_PREFIX}${managerIdx}`,`${USERNAME_PREFIX}${ownerIdx}`, 63)]
            },
            buying_policies:[],
            discounts:[]  
        }
        state.stores.push(store)
        managerIdx++;
    }
}

//1,000,000 transactions in history
for(var i=0; i<NUM_TRANSACTIONS; i++){
    state.history.push(sb.transaction(
        `${STORENAME_PREFIX}0_0`,
        `${USERNAME_PREFIX}${NUM_USERS-1}`,
        [sb.item('product_0_0_0',1)]
    ))
}



export default state;