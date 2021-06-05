import { Store } from "../store/Store";
import { Appointment } from "./Appointment";
import { Permission } from "./Permission";
import { Subscriber } from "./Subscriber";

export class OwnerAppointment extends Appointment
{
    public constructor(appointer: number, store: number, appointee: number, permission: Permission) {
        super(appointer, store, appointee, permission);
    }
        public available_actions(): String[] 
    {
        throw new Error("Method not implemented.");
    }
    
    public isOwner(): boolean 
    {
        return true;
    }
}