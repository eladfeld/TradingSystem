import { Appointment } from "../../DomainLayer/user/Appointment";
import { Subscriber } from "../../DomainLayer/user/Subscriber";



export interface iSubscriberDB
{
    getLastId() : Promise<number>

    addSubscriber: (username: string, password: string, age: number) => Promise<void>

    addSystemManager: (subscriber: Subscriber) => Promise<void>;

    isSystemManager: (userId: number) => Promise<boolean>;

    addProduct:(subscriberId: number, storeId: number, productId: number, quantity : number) => Promise<void>;

    updateCart: (subscriberId: number, storeId: number, productId: number, newQuantity:number) => Promise<void>;

    getSubscriberById: (userId : number) => Promise<Subscriber>

    getSubscriberByUsername: (username: string) => Promise<Subscriber>;

    addAppointment:(userId : number, appointment : Appointment) => Promise<void>;

    getAppointment:(userId : number, storeId : number) => Promise<Appointment>;

    deleteBasket:(userId: number, storeId: number) => Promise<void>;

    deleteAppointment:(appointee: number, appointer: number, storeId: number) =>void;

    addPendingMessage:(userId: number, message: string) => void;

    deletePendingMessages:(userId: number) => void;

    

    clear:() => void;
    
}