import { isOk, Result } from "../../Result";
import { buyingOption } from "../store/BuyingOption";
import { Store } from "../store/Store";
import { Appointment } from "./Appointment";
import { Authentication } from "./Authentication";
import { ACTION } from "./Permission";
import {  User } from "./User";


export class Subscriber extends User
{

    private username: string;
    private hashPassword: string;
    private age: number
    private appointments: Appointment[];
    private pending_messages: {}[];

    public constructor(username: string, age: number ){
        super();
        this.username = username;
        this.age = age;
        this.appointments = [];
        this.pending_messages=[]
    }

    static buildSubscriber(username: string, hashpassword: string, age: number): Subscriber {
        let subscriber: Subscriber = new Subscriber(username, age);
        subscriber.hashPassword = hashpassword;
        return subscriber;
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


    public deleteAppointment(store_app: Appointment) 
    {
        this.appointments = this.appointments.filter(app => app !== store_app);
    }

    public isSystemManager(): boolean
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

    public addMessage(message:{}) : void
    {
        console.log("added message");
        this.pending_messages.push(message);
    }

    public getValue = (field: string): number => this.age;
    public isPendingMessages() : boolean
    {
        if (this.pending_messages.length === 0)
            return false;
        return true;
    }

    public takeMessages(): {}[]
    {
        let messages = this.pending_messages;
        this.pending_messages = [];
        return messages;
    }

    



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