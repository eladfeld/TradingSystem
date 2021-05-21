# TradingSystem
A system allowing subscribers to buy and sell items. A full overview of the system's functionality can be found in the documentation [here](documentation/assets/requirements.pdf)

# Configuration File

Variable | Type | Explanation
---------|--------|-----
CHECKOUT_TIMEOUT | nmuber | max time between checkout and order completion
CACHE_SIZE | number | size of the cache in bytes
SHOULD_INIT_STATE | boolean |true if loading an initial state
INITIAL_STATE | systemState | the initial state of the system if SHOULD_INIT_STATE = true


# Initializing State

You can initialize the system to a specific state of choice. define a state type obect with all the subscribers, stores, and transactions that the state should contain on startup. Set your state object to the INITIAL_STATE parameter in [config.ts](dev/Server/src/config.ts). you can enable/disable the state initialization by toggling the SHOULD_INIT_STATE parameter in [config.ts](dev/Server/src/config.ts). An initial state will be acheived only by legal interactions with the system at the highest level (as if a user performed the necesary actions one by one). If the desired initial state can not be successfully acheived, the system will shut down. 
[StateBuilder.ts](dev/Server/src/ServiceLayer/state/StateBuilder.ts) may come in handy for creating states in a tidy and compact manner. It will also enforce proper typing. refer to the type interfaces in  [StateBuilder.ts](dev/Server/src/ServiceLayer/state/StateBuilder.ts)

## Unsupported Initial States
- states that depend on closing a store
- states that depend on removing a store owner/manager
- states requiring a change in a store manager's priveledges
- states with active guest users
- states dependent on product price changes, changes in a buying policy, or changes in a discount policy
- states with transactions at times of choice (transactions' times will be the time of system initialization) 

## State Signature Type

```
type systemState = {
    subscribers:subscriberState[],
    history:    transactionState[],
    stores:     storeState[]
};

type subscriberState =  {name: string, password:string,logged_in:boolean,cart:basketState[]};
type itemState =        {name:string, quantity:number};
type basketState =      {store:string, items:itemState[]};
type categoryState =    {name:string, categories:categoryState[]};
type storeItemState =   {name:string, categories:string[], price: number, quantity:number};
type ownerState =       {name:string, appointer:string};
type managerState =     {name:string, appointer:string, permissions:number};

type transactionState = {store:string, user:string, basket:itemState[]};

type simpleOperand =    number | string;
type predState =        simplePredState | compositePredState;
type simplePredState =  {
                            type:"simple",
                            operand1:simpleOperand, 
                            operator:string, 
                            operand2:simpleOperand
                        };
type compositePredState =           {type:"composite", operator:string, operands: predState[]};
                        
type policyState =                  {name:string, rule:predState};
type unconditionalDiscountState =   {type:"uncoditional",category:string|number, ratio:number};
type conditionalDiscountState =     {type:"coditional",category:string|number, ratio:number, predicate:predState};
type simpleDiscountState =          unconditionalDiscountState | conditionalDiscountState;
type discountState =                simpleDiscountState | comboDiscountState;
type comboDiscountState =           {type:"combo", policy:string, discounts:discountState[]};
discountWithNameState =             {name: string, discount: discountState};

type employeesState =               {owners: ownerState[], managers:managerState[]};
type storeState =                   {
                                        name:string,
                                        founder:string,
                                        categories:categoryState[],
                                        inventory:storeItemState[], 
                                        employees:employeesState, 
                                        buying_policies:policyState[],
                                        discounts:discountWithNameState[]
                                    };
```


## Initial Subscribers

Subscribers require the user to provide their username, password, whether they are logged in, and the state of their shopping cart. names of items in the shopping cart must be declared in their respective stores inventories. references to this subscriber in other parts of the state will use the subscribers name.

## Initial Stores

Stores require the user to provide the store's name, username of the store's founder, categories, inventory, store owners/managers, stores buying policies, and active discounts. references to this store in other parts of the state will use the stores name.

### Store Categories

A stores categories is provided as a list of trees, where categories may contain subcategories.

### Store Inventory

The store's inventory is provided as a list of products containing the product's name, price, quantity, and the categories that the product belongs to.

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

### Store Buying Policy

A stores buying policies is a list of predicates that must be satisfied in order for a purchase to be approved. The predicates may pertain to the shopping basket's content, the user, or global information (i.e. date, time). Simple predicates have and operator and 2 operands representing a boolean resulting calculation between 2 numbers.
currently supported  simple predicate operators include ``` ["=" , "!=" , "<" , "<=" , ">=" , ">" ]```
currently supported composite prediate operators include ``` [ "and" , "or", "xor" , "=>" , "iff"]  ```
in order to support additional operators, add them to [LogicalOperators.ts](dev/Server/src/DomainLayer/discout/logic/LogicalOperators.ts)
The operand string values you provide to simple predicates must be relevent to the subject which the predicate is intended to query. for a buying policy, the strings must obey the following formats:
query | meaning
-----|-----
time | the current time
date | the current date
u_age| the age of the buying user
b_{SUBJECT}_{FIELD} | the value of the field for the subject in the basket. {SUBJECT} can be the productId (or "product:{productName}" in initial state file) or the category name. {FIELD} must be "quantity" or "price". additional queries may be supported by updating the ```getValue()``` function in the subject class.
Simple predicate examples:
```
basketHasAlcoholPredicate = {
    type:"simple":
    operand1: "b_alcohol_quantity", //quantity of items in basket belonging to the alcohol category
    operator: ">",
    operand2: 0
}

userIsAnAdultPredicate = {
    type:"simple":
    operand1: "u_age", //age of the user buying the product
    operator: ">",
    operand2: 18
}
```

composite predicates represent boolean resulting operations between at least 2 booleans.
Composite predicate example:
```
minorIsNotBuyingAlcoholPredicate = {
    type: "composite",
    operator: "=>",
    operands: [
        basketHasAlcoholPredicate,
        userIsAnAdultPredicate
    ]
}
```
Note: when more than 2 operands are provided, the result is binarily folded right 
(i.e. A & B & C = ((A & B) & C)) this may not be what you want.

### Store Discounts

A stores discount may pertain to products, categories, or the entire store. Discounts may have conditions attached. Combo discounts may be composed of other discounts with a policy regarding how they may be combined. This is a tree structure with simple discounts as the leaves. simple discounts must have the ratio of the price that will be discounted.
currently supported combo discounts are :
name | meaning
-----|------
"add" | discounts may be used together and will all be applied
"max" | discounts may not be used together and only the best of them will be applied

Additional discount combination policies may be added in the [ComboPolicies.ts](dev/Server/src/DomainLayer/discout/ComboPolicies.ts)

supported queries for discount predicates, include only those supported by the buying policy regarding the basket subject. the syntax is the same, but without the "b_" prefix.
