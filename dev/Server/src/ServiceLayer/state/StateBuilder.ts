import { type } from "os";

export type subscriberState = {name: string, password:string,logged_in:boolean,cart:basketState[]};
export type itemState = {name:string, quantity:number};
export type basketState = {store:string, items:itemState[]};
export type categoryState = {name:string, categories:categoryState[]};
export type storeItemState = {name:string, categories:string[], price: number, quantity:number};
export type ownerState = {name:string, appointer:string};
export type managerState = {name:string, appointer:string, permissions:number};
export type simpleOperand = number | string;
export type predState = simplePredState | compoundPredState;
export type simplePredState = {type:"simple",operand1:simpleOperand, operator:string, operand2:simpleOperand};
export type compoundPredState = {type:"compound", operator:string, operands: predState[]};
export type transactionState = {store:string, user:string, basket:itemState[]};
export type policyState = {name:string, rule:predState};
export type unconditionalDiscountState = {type:"uncoditional",category:string, ratio:number};
export type conditionalDiscountState = {type:"coditional",category:string, ratio:number, predicate:predState};
export type simpleDiscountState = unconditionalDiscountState | conditionalDiscountState;
export type discountState = simpleDiscountState | comboDiscountState;
export type comboDiscountState = {type:"combo", policy:string, discounts:discountState[]};
export type discountWithNameState = {name: string, discount: discountState};



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

    compoundPred = (operator:string, operands:predState[]):compoundPredState =>{
        return {type:"compound", operator, operands};
    }

    policy = (name:string, rule:predState):policyState => {
        return {name, rule};
    }

    unconditionalDiscount = (ratio:number, category:string):unconditionalDiscountState => {
       return  {type:"uncoditional",category, ratio};
    }

    conditionalDiscount = (ratio:number, category:string, predicate:predState): conditionalDiscountState => {
        return {type:"coditional",category, ratio, predicate};
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