import { Appointment } from "../../DomainLayer/user/Appointment";
import { Subscriber } from "../../DomainLayer/user/Subscriber";



export interface iSubscriberController
{
    addSubscriber: (username: string, password: string, age: number) => void

    addSystemManager: (subscriber: Subscriber) => void;

    isSystemManager: (userId: number) => Promise<boolean>;

    addProduct:(subscriberId: number, productId: number, quantity : number) => void;

    updateCart: (subscriberId: number, storeId: number, productId: number, newQuantity:number) => void;

    getSubscriberById: (userId : number) => Promise<Subscriber>

    getSubscriberByUsername: (username: string) => Promise<Subscriber>;

    addAppointment:(userId : number, appointment : Appointment) => Promise<void>;

    getAppointment:(userId : number, storeId : number) => Promise<Appointment>;

    deleteBasket:(userId: number, storeId: number) => void;
    
}