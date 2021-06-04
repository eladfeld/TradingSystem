import { makeFailure, makeOk, Result } from "../../Result";
import { Logger } from "../../Logger";
import { Store } from "../store/Store";
import { ACTION, Permission } from "./Permission";
import { Subscriber } from "./Subscriber";






export abstract class Appointment {

    appointer: Subscriber;
    appointee: Subscriber;
    store: Store;
    permission: Permission;


    public constructor(appointer: Subscriber, store: Store, appointee: Subscriber, permission: Permission) {
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

    public getStore(): Store {
        return this.store;
    }

    public getAppointee(): Subscriber {
        return this.appointee;
    }

    public getAppointer(): Subscriber {
        return this.appointer;
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