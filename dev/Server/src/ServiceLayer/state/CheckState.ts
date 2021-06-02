import { alcohols, beverages, categories, CATEGORIES, foodCategories, INVENTORY, smoking, videoGames } from './InitialStateConstants';
import StateBuilder, { PRODUCT_PREF, systemState, transactionState } from './StateBuilder';

const empty: transactionState[] = [];
const sb: StateBuilder = new StateBuilder();

const state:systemState = {

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
        sb.subscriber("u2"),
        sb.subscriber("u3")
    ],
    history:[]
};
export default state;

