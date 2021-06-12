import StateBuilder, { PRODUCT_PREF, storeState, systemState, transactionState } from '../../../src/ServiceLayer/state/StateBuilder';

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

const state:systemState = {//start lists as empty

    stores:[
        {
            name:"s1",
            founder:"u2",
            categories: [],
            inventory:[sb.storeItem("Bamba",[], 30, 20)],
            employees:{
                owners:[],
                managers:[sb.manager("u3","u2", 63)]
            },
            buying_policies:[],
            discounts:[]  
        }
    ],
    subscribers:[
        sb.subscriber("u2", "123", false, [sb.basket("s1", [sb.item("Bamba", 1)])] ),
        sb.subscriber("u3")
    ],
    history:[]
};

const USERNAME_PREFIX = 'user_sl2_';
const STORENAME_PREFIX = 'store_sl2_'

//subscribers
for(var i=0; i<NUM_USERS; i++){
    state.subscribers.push(sb.subscriber(`${USERNAME_PREFIX}${i}`));
}

//stores
for(var ownerIdx=0; ownerIdx<NUM_STORE_OWNERS; ownerIdx++){
    for(var storeIdx=0; storeIdx<10; storeIdx++){
        const store: storeState = {
            name:`${STORENAME_PREFIX}${ownerIdx}_${storeIdx}`,
            founder:`${USERNAME_PREFIX}${ownerIdx}`,
            categories: [],
            inventory:[sb.storeItem("Bamba",[], 30, 20)],//have a generator
            employees:{
                owners:[],
                managers:[sb.manager("u3","u2", 63)]
            },
            buying_policies:[],
            discounts:[]  
        }
    }
}


export default state;