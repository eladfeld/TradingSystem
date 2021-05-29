import subscriberDB from "../../DataAccessLayer/SubscriberDummyDb";
import { isOk, Result } from "../../Result";
import { Publisher } from "../notifications/Publisher";
import { buyingOption } from "../store/BuyingOption";
import { Store } from "../store/Store";
import { Appointment } from "./Appointment";
import { Authentication } from "./Authentication";
import { ACTION } from "./Permission";
import { ShoppingBasket } from "./ShoppingBasket";
import { SubscriberHistory } from "./SubscriberHistory";
import {  User } from "./User";


export class Subscriber extends User
{

    private username: string;
    private hashPassword: string;
    private age: number

    private appointments: Appointment[];
    private history: SubscriberHistory;
    private pending_messages: string[];

    public constructor(username: string, hashedPassword : string, age: number ){
        super();
        this.username = username;
        this.hashPassword = hashedPassword;
        this.age = age;
        this.appointments = [];
        this.pending_messages=[]
        this.history = new SubscriberHistory(this.userId)
    }

    static buildSubscriber(username: string, hashpassword: string, age: number): Subscriber {
        let subscriber: Subscriber = new Subscriber(username, hashpassword, age);
        return subscriber;
    }
    
    public addProductToShoppingCart(storeId: number,  productId: number, quantity: number) : Promise<ShoppingBasket>
    {
        let addp = this.shoppingCart.addProduct(storeId, productId, quantity);
        return new Promise ((resolve,reject) => {
            addp.then( shoppingbasket => {
                subscriberDB.addProduct(this.userId, productId, quantity);
                resolve(shoppingbasket)
            })
            .catch( error => reject(error))
        })
    }

    public setPassword(hashPassword: string){
        this.hashPassword = hashPassword;
    }


    public getUsername(): string
    {
        return this.username;
    }


    public getPassword(): string
    {
        return this.hashPassword;
    }


    public printUser(): string
    {
        return `username: ${this.username}`
    }

    public addAppointment(appointment: Appointment) : void
    {
        this.appointments.push(appointment);
    }

    // returns an appointments of current user to storeId if exists
    public getStoreapp(storeId : number) : Appointment
    {
        return this.appointments.find( appointment => appointment.getStore().getStoreId() === storeId);
    }

    //returns true if this subscriber perform this <action> on this <store>
    public checkIfPerrmited(action : ACTION , store: Store) : boolean
    {
        let store_app : Appointment = this.getStoreapp(store.getStoreId());
        if (store_app != undefined)
            if (store_app.checkIfPermited(action))
                return true;
        return false;
    }

    public editCart(storeId: number, productId: number, quantity: number): Promise<string>
    {
        let editp = this.shoppingCart.editStoreCart(storeId, productId, quantity);
        return new Promise( (resolve,reject) => {
            editp.then ( msg => {
                subscriberDB.updateCart(this.userId, storeId, productId, quantity)
                resolve(msg)
            })
            editp.catch( error => {
                reject(error)
            })
        })
    }

    public deleteAppointment(store_app: Appointment) 
    {
        this.appointments = this.appointments.filter(app => app !== store_app);
    }

    public isSystemManager(): Promise<boolean>
    {
        return Authentication.isSystemManager(this.userId);
    }

    isManager(storeId: number): boolean
    {
        let storeApp: Appointment = this.getStoreapp(storeId);
        if( storeApp !== undefined)
            return storeApp.isManager();
        return false;
    }
    
    isOwner(storeId: number): boolean
    {
        let storeApp: Appointment = this.getStoreapp(storeId);
        if (storeApp != undefined)
            return storeApp.isOwner();
        return false;
    }

    public addMessage(message:string) : void
    {
        this.pending_messages.push(message);
    }


    public getValue = (field: string): number => this.age;
    public isPendingMessages() : boolean
    {
        if (this.pending_messages.length === 0)
            return false;
        return true;
    }

    public takeMessages(): string[]
    {
        let messages = this.pending_messages;
        this.pending_messages = [];
        return messages;
    }

    public getStores() : {}
    {
        let stores: any =[] 
        this.appointments.forEach( appointment =>{
            stores.push({storeId: appointment.getStore().getStoreId(), storeName: appointment.getStore().getStoreName() , permissions: appointment.getPermissions()})
        })
        return JSON.stringify({stores:stores})
    }

    public getPurchaseHistory()
    {
        return this.history.getPurchaseHistory()
    }
    
    public getPermission(storeId: number): number
    {   
        let appoint: Appointment = this.appointments.find(apppintment => apppintment.getStore().getStoreId() === storeId );
        if(appoint !== undefined)
        {
            return appoint.getPermissions().getPermissions();
        }
        return 0;
    }

    public getAge = ():number => this.age;

    //-----------------------------functions for tests---------------------------------------------
    public getAppointments() : Appointment[]
    {
        return this.appointments;
    }

    public getMessages()
    {
        return this.pending_messages;
    }
}