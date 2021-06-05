import { makeFailure, makeOk, Result } from "../../Result";
import { Logger } from "../../Logger";
import { Store } from "../store/Store";
import { ACTION, Permission } from "./Permission";
import { Subscriber } from "./Subscriber";
import { StoreDB, subscriberDB } from "../../DataAccessLayer/DBinit";






export abstract class Appointment {

    appointer: number;
    appointee: number;
    store: number;
    permission: Permission;


    public constructor(appointer: number, store: number, appointee: number, permission: Permission) {
        this.appointee = appointee;
        this.appointer = appointer;
        this.store = store;
        this.permission = permission;
    }

    editPermissions(permissionMask: number): Promise<string> 
    {
        this.permission.setPermissions(permissionMask);
        return Promise.resolve("permission changed successfully");
    }

    public getStore(): Promise<Store> {
        return StoreDB.getStoreByID(this.store);
    }

    public getStoreId() {
        return this.store;
    }

    public getAppointeeId(): number {
        return this.appointee;
    }

    public getAppointerId(): number {
        return this.appointer;
    }

    public getAppointee() : Promise<Subscriber>
    {
        return subscriberDB.getSubscriberById(this.appointee);
    }

    public getAppointer() : Promise<Subscriber>
    {
        return subscriberDB.getSubscriberById(this.appointer);
    }

    public getPermissions(): Permission {
        return this.permission;
    }

    checkIfPermited(action: ACTION) 
    {
        return this.permission.checkIfPermited(action);    
    }

    public isOwner() : boolean
    {
        return false;
    }

    public isManager() : boolean
    {
        return false;
    }

    public abstract available_actions(): String[];

}