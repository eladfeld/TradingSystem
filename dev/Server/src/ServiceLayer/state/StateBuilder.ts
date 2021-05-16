import { type } from "os";

type subscriberState = {name: string, password:string,logged_in:boolean,cart:basketState[]};
type itemState = {name:string, quantity:number};
type basketState = {store:string, items:itemState[]};
type categoryState = {name:string, categories:categoryState[]};
type storeItemState = {name:string, categories:string[], price: number, quantity:number};
type ownerState = {name:string, appointer:string};
type managerState = {name:string, appointer:string, permissions:number};



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
}