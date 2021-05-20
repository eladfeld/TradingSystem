# TradingSystem
Workshop on Software Engineering Project

# Configuration File

Variable | Explanation
---------|-------------
CHECKOUT_TIMEOUT | max time between checkout and order completion
CACHE_SIZE | size of the cache in bytes
SHOULD_INIT_STATE | true if loading an initial state from state.ts


# Initializing State

You can initialize the system to a specific state. in the state.ts file, define the subscribers, stores, and transactions
that the state will contain on startup. Toggle this feature with the SHOULD_INIT_STATE parameter in config.ts. The state
will be acheived only by legal interactions with the system at the highest level (as if a user performed the necesary actions one by one). If the desired initial state can not be successfully acheived, the system will shut down. 
StateBuilder.ts may come in handy for creating states in a tidy and compact manner. It will also enforce proper typing. refer to the type interfaces in  [StateBuilder.ts](dev/Server/src/ServiceLayer/state/StateBuilder.ts)

## Unsupported Initial States
- states that depend on closing a store
- states that depend on removing a store owner/manager
- states requiring a change in a store manager's priveledges
- states with active guest users
- states dependent on product price changes, changes in a buying policy, or changes in a discount policy
- states with transactions at times of choice (transactions' times will be the time of system initialization) 

```
state = {
    subscribers:[ ... ],
    stores:[ ... ],
    history:[ ... ]
}
```

## Initial Subscribers

Subscribers require the user to provide their username, password, whether they are logged in, and the state of their
shopping cart. items in the shopping cart must be declared in the respective stores inventories.

```
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
    ]
```

## Initial Stores

Stores require the user to provide the store's name, username of the store's founder, categories, inventory, store owners/managers, stores buying policies, and active discounts.

```
    stores:[
        {
            name:"Walmart",
            founder:"joe",
            categories:[ ... ],
            inventory:[ ... ],
            employees:{
                owners:[ ... ],
                managers:[ ... ]
            },
            buying_policies:[ ... ],
            discounts:[ ... ]    
        }
    ]
```

### Store Categories

A stores categories is provided as a list of trees, where categories may contain subcategories.

```
            categories:[
                {
                    name:"food",
                    categories:[
                        {
                            name:"fruit",
                            categories: []
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
            ]
```

### Store Inventory

The store's inventory is provided as a list products containing the product's name, price, quantity, and the categories that the product belongs to.

```
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
            ]
```

### Store Employees

The stores' owners and manager are represented by their username and the username of the owner that appointed them. Store managers also require an integer bit mask signifying their priveledges. Owners must be listed after the owner that appointed them. The store founder should not be listed here.

Bit | Permission
----|-----------
1 | can appoint managers
2 | can appoint owners
4 | can edit the stores inventory
8 | can remove managers
16 | can view the store's transaction history
32 | can view the store's staffs' information

```
            employees:{
                owners:[
                    {
                        name:"john",
                        appointer:"joe"
                    },
                    {
                        name:"josh",
                        appointer:"john"
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
            }
```

### Store Buying Policy

A stores buying policies is a list of predicates that must be satisfied in order for a purchase to be approved. The predicates may pertain to the shopping basket's content, the user, or global information (i.e. date, time).

```
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
                }            
            ]
```

### Store Discounts

A stores discount may pertain to products, categories, or the entire store. Discounts may have conditions attached. Combo discounts may be composed of other discounts with a policy regarding how they may be combined. This is a tree structure with simple discounts as the leaves. simple discounts must have the ratio of the price that will be discounted.

```
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
```

## Initial Transactions History

```
history:[
    {
        store:"Walmart, 
        user:"tupac", 
        basket:[{name:"apple", quantity:5},{name:"banana", quantity:2}] 
    }
]
```