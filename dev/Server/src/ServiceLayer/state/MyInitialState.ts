import { alcohols, beverages, categories, CATEGORIES, foodCategories, INVENTORY, smoking, videoGames } from './InitialStateConstants';
import StateBuilder, { PRODUCT_PREF, systemState, transactionState } from './StateBuilder';

const empty: transactionState[] = [];
const sb: StateBuilder = new StateBuilder();

const state:systemState = {

    stores:[
        {
            name:"Walmart",
            founder:"joe",
            categories: CATEGORIES,
            inventory:INVENTORY,
            employees:{
                owners:[
                    sb.owner("john","joe"),
                    sb.owner("josh","joe")
                ],
                managers:[
                    sb.manager("jack","josh", 15),
                    sb.manager("jim", "josh", 11)
                ]
            },
            buying_policies:[
                // sb.policy(
                //     "only adults can drink",
                //     sb.compoundPred("=>",[
                //         sb.simplePred(`b_${alcohols.goldstar}_quantity`,">",0),
                //         sb.simplePred("u_age",">",18)                           
                // ])),
                sb.policy(
                    "only babies can smoke",
                    sb.compoundPred("=>",[
                        sb.simplePred(`b_${categories.SMOKE}_quantity`,">",0),
                        sb.simplePred("u_age","<",3)                            
                ])),
                sb.policy(
                    "cant buy exactly 5 Big Red Soda",
                        sb.simplePred(`b_${PRODUCT_PREF}Big Red Soda_quantity`,"!=",5),                          
                )
            ],
            discounts:[
                sb.discountWithName("10% off tetris", sb.unconditionalDiscount(0.10,`${PRODUCT_PREF}${videoGames.tetris}`)),
                // sb.discountWithName("20% off food", sb.unconditionalDiscount(0.20,categories.FOOD)),
                // sb.discountWithName("20% off snacks", sb.unconditionalDiscount(0.20,foodCategories.SNACKS))
                // sb.discountWithName(
                //     "15% apples and 10% off food",
                //     sb.comboDiscount("add",[
                //         sb.unconditionalDiscount(0.15, `${PRODUCT_PREF}apple`),
                //         sb.unconditionalDiscount(0.10, "food")          
                //     ])),
                // sb.discountWithName("10% off tetris", sb.unconditionalDiscount(0.10,"tetris")),
                // sb.discountWithName("fake discount", sb.conditionalDiscount(0.10, "Food", sb.simplePred(1,">",2)))
            ]  
        }
    ],
    subscribers:[
        sb.subscriber("joe"),
        sb.subscriber("john"),
        sb.subscriber("josh"),
        sb.subscriber("jack"),
        sb.subscriber("jim"),
        sb.subscriber("tupac","123",true, [
            sb.basket("Walmart",
                [sb.item(videoGames.minecraft, 10), sb.item(videoGames.tetris, 1),
                    sb.item(alcohols.goldstar,6), sb.item(smoking.camel,1)]
            )
        ])
    ],
    history:
    [
        sb.transaction("Walmart", "tupac", [
            sb.item("Combos", 50)
        ])
    ]
};
export default state;

