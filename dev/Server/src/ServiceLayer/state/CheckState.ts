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
            inventory:[sb.storeItem("Bamba",[], 30, 20000000)],
            employees:{
                owners:[],
                managers:[sb.manager("u3","u2", 63)]
            },
            buying_policies:[],
            discounts:[
                //sb.discountWithName("50% off bamaba", sb.unconditionalDiscount(0.50,`${PRODUCT_PREF}Bamba`)),
            ]  
        }
    ],
    subscribers:[
        sb.subscriber("u2", "123", false, [sb.basket("s1", [sb.item("Bamba", 1)])] ),
        sb.subscriber("u3")
    ],
    history:[
        sb.transaction("s1", "u3", [
            sb.item("Bamba", 100)
        ])
    ]
};
export default state;

