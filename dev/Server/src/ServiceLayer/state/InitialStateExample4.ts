import { CATEGORIES, INVENTORY } from './InitialStateConstants';
import StateBuilder, { transactionState } from './StateBuilder';

const empty: transactionState[] = [];
const sb: StateBuilder = new StateBuilder();

const state = {

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
                sb.policy(
                    "only adults can drink",
                    sb.compoundPred("=>",[
                        sb.simplePred("b_alcohol_quantity",">",0),
                        sb.simplePred("u_age",">",18)                           
                ])),
                sb.policy(
                    "only babies can smoke",
                    sb.compoundPred("=>",[
                        sb.simplePred("b_tobacco_quantity",">",0),
                        sb.simplePred("u_age","<",3)                            
                ]))           
            ],
            discounts:[
                {
                    name:"15% apples and 10% off food",
                    discount: sb.comboDiscount("add",[
                        sb.unconditionalDiscount(0.15, "product:apple"),
                        sb.unconditionalDiscount(0.10, "food")          
                    ])
                }
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
            // sb.basket("Walmart",
            //     [sb.item("Minecraft", 10), sb.item("tetris", 1)]
            // )
        ])
    ],
    history: empty
    // [
    //     sb.transaction("Walmart", "tupac", [
    //         sb.item("tetris", 1)
    //     ])
    // ]
};
export default state;

