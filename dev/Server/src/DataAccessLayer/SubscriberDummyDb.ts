import { TEST_MODE } from "../config";
import { Appointment } from "../DomainLayer/user/Appointment";
import { Subscriber } from "../DomainLayer/user/Subscriber";
import { iSubscriberDB } from "./interfaces/iSubscriberDB";

const DISCONNECTED_ERROR = "Database is disconnected";

export class SubscriberDummyDB implements iSubscriberDB
{

    // #saveDB  ----------------------move all the class to save in the real db
    private subscribers: Subscriber[];
    private systemManagers: Subscriber[];
    private isConnected: boolean;
    constructor(){
        this.subscribers=[]
        this.systemManagers = []
        this.isConnected = true;
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
        if(!this.isConnected)return Promise.reject(DISCONNECTED_ERROR);
        return this.systemManagers.some(sub => sub.getUserId() === userId);
    }

    public addProduct(subscriberId: number, productId: number, quantity : number) 
    {
        //do nothing here, since we don't have an actual db and the subscriber already added this product, TODO: when we change to db we need to add the basket if needed and add the product right after
    }

    public updateCart(subscriberId: number, storeId: number, productId: number, newQuantity:number)
    {
        //do nothing here, since we don't have an actual db and the subscriber already added this product, TODO: when we change to db we need to add the basket if needed and add the product right after
    }


    public async getSubscriberById(userId : number): Promise<Subscriber>
    {
        if(!this.isConnected)return Promise.reject(DISCONNECTED_ERROR);
        let sub = this.subscribers.find( sub => sub.getUserId() === userId)
        if (sub !== undefined)
            return sub;
        return new Promise( (resolve,reject) => reject("getSubscriberById: subscriber not found"))
    }

    public async getSubscriberByUsername(username: string): Promise<Subscriber>
    {
        if(!this.isConnected)return Promise.reject(DISCONNECTED_ERROR);
        let sub = this.subscribers.find( sub => sub.getUsername() === username)
        if(sub) return Promise.resolve(sub);
        return new Promise((resolve, reject) => reject("getSubscriverByUsername: subscriber not found"))
    }

    public async addAppointment(userId : number, appointment : Appointment) : Promise<void>
    {
        if(!this.isConnected)return Promise.reject(DISCONNECTED_ERROR);
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
        if(!this.isConnected)return Promise.reject(DISCONNECTED_ERROR);
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

    /********************** Functions for tests ************************/
    public willFail = () =>{
        this.isConnected = false;
    }

    public willSucceed = () =>{
        this.isConnected = true;
    }
}

