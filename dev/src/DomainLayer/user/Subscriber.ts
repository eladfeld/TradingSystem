import { Store } from "../store/Store";
import { Appointment, JobTitle } from "./Appointment";
import { Authentication } from "./Authentication";
import { ACTION } from "./Permission";
import { User } from "./User";



export class Subscriber extends User
{
    private username: string;
    private hashPassword: string;
    private appointments: Appointment[];
    
    public constructor(username: string){
        super();
        this.username = username;
        this.appointments = [];
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
            if (store_app.getPermissions().check_action(action))
                return true;
        return false;
    }

    public getTitle(storeId : number) : JobTitle
    {
        let app: Appointment = this.appointments.find( appointment => appointment.getStore().getStoreId() === storeId);
        if (app != undefined)
            return app.getTitle();
        return undefined;
    }

    public deleteAppointment(store_app: Appointment) 
    {
        this.appointments = this.appointments.filter(app => app !== store_app);
    }

    public isSystemManager(): boolean
    {
        return Authentication.isSystemManager(this.userId);
    }


    //-----------------------------functions for tests---------------------------------------------
    public getAppointments() : Appointment[]
    {
        return this.appointments;
    }
}