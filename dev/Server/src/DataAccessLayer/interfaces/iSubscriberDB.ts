import { Appointment } from "../../DomainLayer/user/Appointment";
import { Subscriber } from "../../DomainLayer/user/Subscriber";



export interface iSubscriberDB
{
    getLastUserId() : Promise<number>

    addMessageToHistory:(message: string, userId: number) => Promise<void>;

    addSubscriber: (username: string, password: string, age: number) => Promise<void>

    addSystemManager: (subscriber: Subscriber) => Promise<void>;

    isSystemManager: (userId: number) => Promise<boolean>;

    addProductToCart:(subscriberId: number, storeId: number, productId: number, quantity : number) => Promise<void>;

    updateCart: (subscriberId: number, storeId: number, productId: number, newQuantity:number) => Promise<void>;

    getSubscriberById: (userId : number) => Promise<Subscriber>

    getSubscriberByUsername: (username: string) => Promise<Subscriber>;

    addAppointment:(userId : number, appointment : Appointment) => Promise<void>;

    getAppointment:(userId : number, storeId : number) => Promise<Appointment>;


    /* For testing purposes, real DB implementations should throw exception on calling these*/
    willFail: () => void; 
    willSucceed: () => void; 
    deleteBasket:(userId: number, storeId: number) => Promise<void>;

    deleteAppointment:(appointee: number, appointer: number, storeId: number) =>void;

    addPendingMessage:(userId: number, message: string) => void;

    deletePendingMessages:(userId: number) => void;

    updatePermission:(storeId: number, managerToEditId: number, permissionMask: number) => Promise<void>;

    clear:() => void;
    
}