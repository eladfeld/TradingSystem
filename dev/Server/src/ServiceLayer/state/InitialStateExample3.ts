import StateBuilder from './StateBuilder';

const empty : any[] = [];
const sb: StateBuilder = new StateBuilder();

const state = {

    stores:[
        {
            name:"Walmart",
            founder:"joe",
            categories: [
                sb.category("food",[
                    sb.category("fruit"),
                    sb.category("vegetables")
                ]),
                sb.category("electronics")
            ],
            inventory:[
                sb.storeItem("playstation",["electronics"],249.99,50),
                sb.storeItem("apple",["fruit"],1.99,500)
            ],
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
                {
                    name:"only adults can drink",
                    rule:{
                        type:"compound",
                        operator:"=>",
                        operands:[
                            {
                                type:"simple",
                                operand1:"b_alcohol_quantity",
                                operator:">",
                                operand2:0 
                            },
                            {
                                type:"simple",
                                operand1:"u_age",
                                operator:">",
                                operand2:18                                 
                            }
                        ]
                    }
                },
                {
                    name:"only babies can smoke",
                    rule:{
                        type:"compound",
                        operator:"=>",
                        operands:[
                            {
                                type:"simple",
                                operand1:"b_tobacco_quantity",
                                operator:">",
                                operand2:0 
                            },
                            {
                                type:"simple",
                                operand1:"u_age",
                                operator:"<",
                                operand2:3                                  
                            }
                        ]
                    }
                }
            
            ],
            discounts:[
                {
                    name:"15% apples and 10% off food",
                    discount: {
                        type: "combo",
                        policy: "add",
                        discounts:[
                            {
                                type: "unconditional",
                                category: "product:apple",
                                ratio: 0.15
                            },
                            {
                                type: "unconditional",
                                category: "food",
                                ratio: 0.10
                            }
                        ]
                    }
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
            sb.basket("Walmart",
                [sb.item("apple", 10), sb.item("playstation", 1)]
            )
        ])
    ],
    history:[
        {
            store:"walmart",
            user:"tupac",
            basket:[
                {
                    name:"playstation",
                    quantity:1
                }
            ],
            total:249.99
        }
    ]
};
export default state;

