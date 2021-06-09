import { Appointment } from "../../DomainLayer/user/Appointment";
import { Subscriber } from "../../DomainLayer/user/Subscriber";
import { iSubscriberDB } from "../interfaces/iSubscriberDB";

export class SubscriberDummyDB implements iSubscriberDB
{

    private subscribers: Subscriber[];
    private systemManagers: Subscriber[];
    constructor(){
        this.subscribers=[]
        this.systemManagers = []

    }

    public deleteAppointment(appointee: number, appointer: number, storeId: number) : void
    {
        //do nothing here, since we don't have an actual db and the subscriber already did this in memory
    }

    addPendingMessage(userId: number, message: string) :void
    {       
        //do nothing here, since we don't have an actual db and the subscriber already did this in memory
    }

    deletePendingMessages(userId: number) : void
    {
        //do nothing here, since we don't have an actual db and the subscriber already did this in memory
    }

    public getLastId(): Promise<number> 
    {
        return Promise.resolve(0);
    }

    public addSubscriber(username: string, password: string, age: number)
    {
        let sub = new Subscriber(username, password, age);
        this.subscribers.push(sub);
        return Promise.resolve()
    }

    public addSystemManager(subscriber: Subscriber)
    {
        this.subscribers.push(subscriber);
        this.systemManagers.push(subscriber);
        return Promise.resolve()
    }

    public async isSystemManager(userId: number): Promise<boolean> 
    {
        return this.systemManagers.some(sub => sub.getUserId() === userId);
    }

    public addProduct(subscriberId: number, storeId: number, productId: number, quantity : number) 
    {
        //do nothing here, since we don't have an actual db and the subscriber already did this in memory
        return Promise.resolve()
    }

    public updateCart(subscriberId: number, storeId: number, productId: number, newQuantity:number)
    {
        //do nothing here, since we don't have an actual db and the subscriber already  did this in memory
        return Promise.resolve()
    }

    public updatePermission(storeId: number, managerToEditId: number,permissionMask:number){
        return Promise.resolve();
    }


    public async getSubscriberById(userId : number): Promise<Subscriber>
    {
        let sub = this.subscribers.find( sub => sub.getUserId() === userId)
        if (sub !== undefined)
            return sub;
        return new Promise( (resolve,reject) => reject("getSubscriberById: subscriber not found"))
    }

    public async getSubscriberByUsername(username: string): Promise<Subscriber>
    {
        let sub = this.subscribers.find( sub => sub.getUsername() === username)
        if(sub) return Promise.resolve(sub);
        return new Promise((resolve, reject) => reject("getSubscriverByUsername: subscriber not found"))
    }

    public async addAppointment(userId : number, appointment : Appointment) : Promise<void>
    {
        let sub = this.subscribers.find( sub => sub.getUserId() == userId )
        if (sub !== undefined)
        {
            sub.addAppointment(appointment);
            return;
        }
        return new Promise((resolve, reject) => reject("addAppointment: subscriber not found"))
    }

    public async getAppointment(userId : number, storeId : number) : Promise<Appointment>
    {
        let sub = this.subscribers.find( sub => sub.getUserId() == userId )
        if (sub !== undefined)
        {
            let app =  sub.getStoreapp(storeId);
            return app;
        }
        return new Promise((resolve, reject) => reject("addAppointment: subscriber not found"))
    }
    deleteBasket(userId: number, storeId: number) {
        //do nothing here, since we don't have an actual db and the subscriber already did this in memory
        return Promise.resolve()
    }

    public clear()
    {
        this.subscribers = [];
        this.systemManagers = [];
    }
}

