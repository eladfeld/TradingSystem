import { Appointment } from "./Appointment";
import { Permission } from "./Permission";

export class ManagerAppointment extends Appointment
{
    public constructor(appointer: number, store: number, appointee: number, permission: Permission) {
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