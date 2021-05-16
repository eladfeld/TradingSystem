const empty : any[] = [];

const state = {

    stores:[
        {
            name:"Walmart",
            founder:"joe",
            categories:[
                {
                    name:"food",
                    categories:[
                        {
                            name:"fruit",
                            categories: empty
                        },
                        {
                            name:"vegetables",
                            categories:[]
                        }
                    ]
                },
                {
                    name:"electronics",
                    categories:[]
                }
            ],
            inventory:[
                {
                    name:"play station",
                    categories:["electronics"],
                    price: 249.99,
                    quantity: 50
                },
                {
                    name:"apple",
                    categories:["fruit"],
                    price: 1.99,
                    quantity: 500
                }
            ],
            employees:{
                owners:[
                    {
                        name:"john",
                        appointer:"joe"
                    },
                    {
                        name:"josh",
                        appointer:"joe"
                    }
                ],
                managers:[
                    {
                        name:"jack",
                        permissions: 15,
                        appointer:"josh"
                    },
                    {
                        name:"jim",
                        permissions: 11,
                        appointer:"josh"
                    }
                ]
            },
            buying_policies:[
                {
                    name:"only adults can drink",
                    rule:{
                        type:"compound",
                        operator:"=>",
                        operand1:{
                            type:"simple",
                            operand1:"b_alcohol_quantity",
                            operator:">",
                            operand2:0 
                        },
                        perand2:{
                            type:"simple",
                            operand1:"u_age",
                            operator:">",
                            operand2:18                                 
                        }
                    }
                },
                {
                    name:"only babies can smoke",
                    rule:{
                        type:"compound",
                        operator:"=>",
                        operand1:{
                            type:"simple",
                            operand1:"b_tobacco_quantity",
                            operator:">",
                            operand2:0 
                        },
                        operand2:{
                            type:"simple",
                            operand1:"u_age",
                            operator:"<",
                            operand2:3                                  
                        }
                    }
                }
            
            ],
            discounts:[
                {
                    name:"10% apples",
                    discount:{
                        type:"unconditional",
                        ratio: 0.10,
                        category: 123
                    }
                }
            ]    
        }
    ],
    subscribers:[
        {
            name:"john",
            password:"pwd",
            logged_in:true,
            cart:[
                {
                    store:"walmart",
                    items:[
                        {
                            name:"apple",
                            quantity:10
                        },
                        {
                            name:"playstation",
                            quantity:1
                        }
                    ]
                }
            ]
        }
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

