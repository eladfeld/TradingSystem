import { Logger } from "../../Logger";
import { makeFailure, makeOk, Result } from "../../Result";
import { Store } from "../store/Store";
import { Appointment } from "./Appointment";
import { ManagerAppointment } from "./ManagerAppointment";
import { OwnerAppointment } from "./OwnerAppointment";
import { ACTION, Permission } from "./Permission";
import { Subscriber } from "./Subscriber";


export class MakeAppointment
{
    public static appoint_founder(founder: Subscriber, store: Store): Promise<string> 
    {
        if (founder === undefined || store === undefined) {
            Logger.error("undefined arrgument given");
            return Promise.reject("undefined arrgument given");
        }

        if (founder.getUserId() === store.getStoreFounderId()) 
        {
            // -1 meens 0xFFFFFFF -> so all bits in the mask are turn to 1 and all the actions are permited
            let allGrantedPermission: Permission = new Permission(-1);
            let new_appointment = new OwnerAppointment(founder, store, founder, allGrantedPermission);
            store.addAppointment(new_appointment);
            founder.addAppointment(new_appointment);
            return Promise.resolve("appointment made successfully");
        }
        Logger.log("the candidate is not the store founder");
        return Promise.reject("the candidate is not the store founder");
    }

    public static appoint_owner(appointer: Subscriber, store: Store, appointee: Subscriber): Promise<string> {
        if (appointer === undefined || store === undefined || appointee === undefined) {
            Logger.log("undefined arrgument given");
            return Promise.reject("undefined arrgument given");
        }

        //check if appointer is allowed to appoint owner
        if (appointer.checkIfPerrmited(ACTION.APPOINT_OWNER, store)) 
        {
            let basic_owner_permissions: number = ACTION.APPOINT_MANAGER | ACTION.APPOINT_OWNER | ACTION.INVENTORY_EDITTION | ACTION.VIEW_STORE_HISTORY;
            if ( !appointee.isOwner(store.getStoreId())) //this 'if' deals with cyclic appointments
            {
                if(!appointee.isManager(store.getStoreId()))
                {
                    let new_appointment = new OwnerAppointment(appointer, store, appointee, new Permission(basic_owner_permissions));
                    store.addAppointment(new_appointment);
                    appointee.addAppointment(new_appointment);
                    return Promise.resolve("owner appointed successfully!");
                }
                else
                {
                    let store_app: Appointment = appointee.getStoreapp(store.getStoreId())
                    let prev_permission: Permission = store_app.getPermissions();
                    prev_permission.addPermissions(basic_owner_permissions);
                    appointee.deleteAppointment(store_app);
                    store.deleteAppointment(store_app);
                    let new_appointment = new OwnerAppointment(appointer, store, appointee, prev_permission);
                    store.addAppointment(new_appointment);
                    appointee.addAppointment(new_appointment);
                    return Promise.reject("owner appointed successfully!");
                }
            }
        }
        return Promise.reject("unauthorized try to appoint owner");
    }

    public static appoint_manager(appointer: Subscriber, store: Store, appointee: Subscriber): Promise<string> 
    {
        if (appointer === undefined || store === undefined || appointee === undefined) 
        {
            Logger.error("appoint_manager: undefined arrgument given");
            return Promise.reject("undefined arrgument given");
        }
        //check if appointer is allowed to appoint manager
        if (appointer.checkIfPerrmited(ACTION.APPOINT_MANAGER, store)) 
        {
            let basic_manager_permissions: number = ACTION.VIEW_STORE_HISTORY;

            if ( !appointee.isOwner(store.getStoreId()) && !appointee.isManager(store.getStoreId())) //this 'if' deals with cyclic appointments
            {
                let new_appointment = new ManagerAppointment(appointer, store, appointee, new Permission(basic_manager_permissions));
                store.addAppointment(new_appointment);
                appointee.addAppointment(new_appointment);
                return Promise.resolve("manager appointed successfully!");
            }
            else {
                return Promise.reject("user already appointed");
            }
        }
        return Promise.reject("unauthorized try to appoint manager");
    }

    public static removeAppointment(appointment: Appointment): Result<string> {
        if (appointment === undefined) {
            return makeFailure("bad argument");
        }
        appointment.appointee.deleteAppointment(appointment);
        appointment.store.deleteAppointment(appointment);

        let appointee: Subscriber = appointment.appointee;

        appointment.store.getAppointments().forEach(appointment => {
            if (appointment.appointer === appointee) this.removeAppointment(appointment)
        })
        return makeOk("appointmetn removed");
    }
}