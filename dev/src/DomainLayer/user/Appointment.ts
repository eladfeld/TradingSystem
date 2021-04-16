import { makeFailure, makeOk, Result } from "../../Result";
import { Logger } from "../Logger";
import { Store } from "../store/Store";
import { ACTION, Permission } from "./Permission";
import { Subscriber } from "./Subscriber";


export enum JobTitle{
    FOUNDER = "founder",
    MANAGER = "manager",
    OWNER = "owner",
}


export class Appointment
{
    private appointer : Subscriber;
    private appointee : Subscriber;
    private store : Store;
    private permission : Permission ;
    private title : JobTitle;


    public constructor(appointer: Subscriber,store: Store, appointee: Subscriber, permission: Permission, title:JobTitle)
    {
        this.appointee = appointee;
        this.appointer = appointer;
        this.store = store;
        this.permission = permission;
        this.title = title;
    }

    public static appoint_founder(founder: Subscriber, store: Store): Result<string>
    {
        if(founder === undefined || store === undefined)
        {
            Logger.error("undefined arrgument given");
            return makeFailure("undefined arrgument given");
        }

        if(founder.getUserId() === store.getStoreFounderId())
        {
            // -1 meens 0xFFFFFFF -> so all bits in the mask are turn to 1 and all the actions are permited
            let allGrantedPermission: Permission = new Permission(-1);
            let new_appointment = new Appointment(founder, store, founder, allGrantedPermission, JobTitle.FOUNDER);
            store.addAppointment(new_appointment);
            founder.addAppointment(new_appointment);
            Logger.log(`the subscriber ${founder.getUsername} is now appointed to be a new store founder at ${store.getStoreId}`);
            return makeOk("appointment made successfully");
        }
        Logger.error("the candidate is not the store founder");
        return makeFailure("the candidate is not the store founder");
    }

    public static appoint_owner(appointer: Subscriber,store: Store, appointee: Subscriber, permission: Permission) : Result<string>
    {
        if(appointer === undefined || store === undefined || appointee === undefined || permission === undefined)
        {
            Logger.error("undefined arrgument given");
            return makeFailure("undefined arrgument given");
        }

        //check if appointer is allowed to appoint owner
        if(appointer.checkIfPerrmited(ACTION.APPOINT_OWNER, store))
        {
            let title: JobTitle = appointee.getTitle(store.getStoreId());
            if (title != JobTitle.OWNER && title != JobTitle.FOUNDER) //this 'if' deals with cyclic appointments
            {
                return this.appointTitle(appointer,store,appointee,permission,JobTitle.OWNER);
            }
        }
        return makeFailure("unauthorized try to appoint owner");
    }

    public static appoint_manager(appointer: Subscriber,store: Store, appointee: Subscriber, permission: Permission) : Result<string>
    {
        if(appointer === undefined || store === undefined || appointee === undefined || permission === undefined)
        {
            Logger.error("appoint_manager: undefined arrgument given");
            return makeFailure("undefined arrgument given");
        }

        //check if appointer is allowed to appoint manager
        if(appointer.checkIfPerrmited(ACTION.APPOINT_MANAGER, store))
        {
            let title: JobTitle = appointee.getTitle(store.getStoreId());
            if (title != JobTitle.OWNER && title != JobTitle.MANAGER && title != JobTitle.FOUNDER) //this 'if' deals with cyclic appointments
            {
                return this.appointTitle(appointer,store,appointee,permission,JobTitle.MANAGER);
            }
            else
            {
                return makeFailure("user already appointed");
            }
        }
        return makeFailure("unauthorized try to appoint manager");
    }

    private static appointTitle(appointer: Subscriber,store: Store, appointee: Subscriber, permission: Permission, title : JobTitle) : Result<string>
    {
        let store_app : Appointment = appointee.getStoreapp(store.getStoreId()) 
        // no previous appointments
        if (store_app === undefined)
        {
            let new_appointment = new Appointment(appointer,store,appointee,permission, title);
            store.addAppointment(new_appointment);
            appointee.addAppointment(new_appointment);
        }
        else    //there is old appointment to this user remove old and replace with new appointment (save old permissions)
        {
            let prev_permission : Permission = store_app.getPermissions();
            let new_permission_mask : number = prev_permission.getPermissions() | permission.getPermissions();
            appointee.deleteAppointment(store_app);
            store.deleteAppointment(store_app);
            let new_appointment = new Appointment(appointer,store,appointee,new Permission(new_permission_mask), title);
            store.addAppointment(new_appointment);
            appointee.addAppointment(new_appointment);
        }
        Logger.log(`the subscriber ${appointee.getUsername} is now appointed to be a new store ${title} at ${store.getStoreId}`);
        return makeOk("appointment made successfully");
    }

    private static removeAppointment(appointment: Appointment)
    {
        appointment.appointee.deleteAppointment(appointment);
        appointment.store.deleteAppointment(appointment);

        let appointee: Subscriber = appointment.appointee;

        appointment.store.getAppointments().forEach(appointment => {
            if(appointment.appointer === appointee) this.removeAppointment(appointment)
        })
    }

    public getStore() : Store
    {
        return this.store;
    }

    public getAppointee() : Subscriber
    {
        return this.appointee;
    }

    public getPermissions() : Permission
    {
        return this.permission;
    }

    public getTitle() : JobTitle
    {
        return this.title;
    }

}