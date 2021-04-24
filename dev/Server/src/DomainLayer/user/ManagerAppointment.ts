import { Store } from "../store/Store";
import { Appointment } from "./Appointment";
import { Permission } from "./Permission";
import { Subscriber } from "./Subscriber";

export class ManagerAppointment extends Appointment
{
    public constructor(appointer: Subscriber, store: Store, appointee: Subscriber, permission: Permission) {
        super(appointer, store, appointee, permission)
    }

    public isManager(): boolean 
    {
        return true;
    }
    public available_actions(): String[] 
    {
        throw new Error("Method not implemented.");
    }
    
}