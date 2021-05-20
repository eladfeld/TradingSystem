import { type } from "os";
import { tComboDiscount, tConditionalDiscount, tDiscount, tSimpleDiscount, tUnconditionalDiscount } from "../../DomainLayer/discount/Discount";
import { tCompositePredicate, tSimplePredicate } from "../../DomainLayer/discount/logic/Predicate";

export type subscriberState = {name: string, password:string,logged_in:boolean,cart:basketState[]};
export type itemState = {name:string, quantity:number};
export type basketState = {store:string, items:itemState[]};
export type categoryState = {name:string, categories:categoryState[]};
export type storeItemState = {name:string, categories:string[], price: number, quantity:number};
export type ownerState = {name:string, appointer:string};
export type managerState = {name:string, appointer:string, permissions:number};

export type simpleOperand = number | string;
export type predState = simplePredState | compositePredState;
export type simplePredState = tSimplePredicate;//{type:"simple",operand1:simpleOperand, operator:string, operand2:simpleOperand};
export type compositePredState = tCompositePredicate;//{type:"composite", operator:string, operands: predState[]};
export type policyState = {name:string, rule:predState};

export type unconditionalDiscountState = tUnconditionalDiscount;//{type:"uncoditional",category:string|number, ratio:number};
export type conditionalDiscountState = tConditionalDiscount;//{type:"coditional",category:string|number, ratio:number, predicate:predState};
export type simpleDiscountState = tSimpleDiscount;//unconditionalDiscountState | conditionalDiscountState;
export type discountState = tDiscount;//simpleDiscountState | comboDiscountState;
export type comboDiscountState = tComboDiscount;//{type:"combo", policy:string, discounts:discountState[]};
export type discountWithNameState = {name: string, discount: discountState};

export type employeesState = {owners: ownerState[], managers:managerState[]};
export type storeState = {name:string, founder:string, categories:categoryState[], inventory:storeItemState[],
    employees:employeesState, buying_policies:policyState[], discounts:discountWithNameState[]};
export type systemState = {stores:storeState[], subscribers:subscriberState[], history:transactionState[]};

export type transactionState = {store:string, user:string, basket:itemState[]};

export const PRODUCT_PREF = "product:";

export default class StateBuilder{
    constructor(){

    }

    subscriber = (name: string, password:string="123",logged_in:boolean=true,cart:basketState[]=[]):subscriberState =>{
        return{ name, password, logged_in, cart};
    }

    item = (name:string, quantity:number):itemState => {
        return{ name, quantity};
    }

    basket = (store:string, items:itemState[]):basketState => {
        return {store, items};
    }

    category = (name:string, categories:categoryState[]=[]):categoryState => {
        return {name, categories};
    }

    storeItem = (name:string, categories:string[], price: number, quantity:number):storeItemState => {
        return {name, categories, price, quantity};
    }

    owner = (name:string, appointer:string):ownerState =>{
        return {name, appointer};
    }

    manager = (name:string, appointer:string, permissions:number):managerState =>{
        return {name, appointer, permissions};
    }

    simplePred = (operand1:simpleOperand, operator:string, operand2:simpleOperand):simplePredState =>{
        return{type:"simple",operand1, operator, operand2};
    }

    compoundPred = (operator:string, operands:predState[]):compositePredState =>{
        return {type:"composite", operator, operands};
    }

    policy = (name:string, rule:predState):policyState => {
        return {name, rule};
    }

    unconditionalDiscount = (ratio:number, category:string):unconditionalDiscountState => {
       return  {type:"unconditional",category, ratio};
    }

    conditionalDiscount = (ratio:number, category:string, predicate:predState): conditionalDiscountState => {
        return {type:"conditional",category, ratio, predicate};
    }

    comboDiscount = (policy:string, discounts:discountState[]):comboDiscountState => {
        return {type:"combo", policy, discounts};
    }


    transaction = (store:string, user:string, basket:itemState[]) =>{
        return {store, user, basket};
    }

    discountWithName = (name: string, discount: discountState) => {
        return {name, discount};
    }
}