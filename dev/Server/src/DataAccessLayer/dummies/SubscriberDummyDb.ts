import { TEST_MODE } from "../../config";
import { Appointment } from "../../DomainLayer/user/Appointment";
import { Subscriber } from "../../DomainLayer/user/Subscriber";
import { iSubscriberDB } from "../interfaces/iSubscriberDB";

export class SubscriberDummyDB implements iSubscriberDB
{

    // #saveDB  ----------------------move all the class to save in the real db
    private subscribers: Subscriber[];
    private systemManagers: Subscriber[];
    constructor(){
        this.subscribers=[]
        this.systemManagers = []

    }

    public addSubscriber(username: string, password: string, age: number)
    {
        let sub = new Subscriber(username, password, age);
        this.subscribers.push(sub);
    }

    public addSystemManager(subscriber: Subscriber)
    {
        this.subscribers.push(subscriber);
        this.systemManagers.push(subscriber);
    }

    public async isSystemManager(userId: number): Promise<boolean> 
    {
        return this.systemManagers.some(sub => sub.getUserId() === userId);
    }

    public addProduct(subscriberId: number, storeId: number, productId: number, quantity : number) 
    {
        //do nothing here, since we don't have an actual db and the subscriber already added this product, TODO: when we change to db we need to add the basket if needed and add the product right after
    }

    public updateCart(subscriberId: number, storeId: number, productId: number, newQuantity:number)
    {
        //do nothing here, since we don't have an actual db and the subscriber already added this product, TODO: when we change to db we need to add the basket if needed and add the product right after
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
        if(sub) return sub;
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
        //do nothing here, since we don't have an actual db and the subscriber already added this product, TODO: when we change to db we need to add the basket if needed and add the product right after
    }

    public clear()
    {
        this.subscribers = [];
        this.systemManagers = [];
    }
}

