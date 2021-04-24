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
    private appointments: Appointment[];

    public constructor(username: string ){
        super();
        this.username = username;
        this.appointments = [];
    }

    static buildSubscriber(username: string, hashpassword: string): Subscriber {
        let subscriber: Subscriber = new Subscriber(username);
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
        return storeApp.isManager();
    }
    
    isOwner(storeId: number): boolean
    {
        let storeApp: Appointment = this.getStoreapp(storeId);
        return storeApp.isOwner();
    }

  



    //-----------------------------functions for tests---------------------------------------------
    public getAppointments() : Appointment[]
    {
        return this.appointments;
    }
}