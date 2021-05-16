import { type } from "os";

type subscriberState = {name: string, password:string,logged_in:boolean,cart:basketState[]};
type itemState = {name:string, quantity:number};
type basketState = {store:string, items:itemState[]};
type categoryState = {name:string, categories:categoryState[]};
type storeItemState = {name:string, categories:string[], price: number, quantity:number};
type ownerState = {name:string, appointer:string};
type managerState = {name:string, appointer:string, permissions:number};
type simpleOperand = number | string;
type predState = simplePredState | compoundPredState;
type simplePredState = {type:"simple",operand1:simpleOperand, operator:string, operand2:simpleOperand};
type compoundPredState = {type:"compound", operator:string, operands: predState[]};
type transactionState = {store:string, user:string, basket:itemState[]};
type policyState = {name:string, rule:predState};
type unconditionalDiscountState = {type:"uncoditional",category:string, ratio:number};
type conditionalDiscountState = {type:"coditional",category:string, ratio:number, predicate:predState};
type simpleDiscountState = unconditionalDiscountState | conditionalDiscountState;
type discountState = simpleDiscountState | comboDiscountState;
type comboDiscountState = {type:"combo", policy:string, discounts:discountState[]};


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
}