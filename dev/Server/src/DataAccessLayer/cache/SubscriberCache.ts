import { SUBSCRIBERS_CACHE_SIZE } from "../../../config";
import { subscribe } from "../../CommunicationLayer/Router";
import { Appointment } from "../../DomainLayer/user/Appointment";
import { Subscriber } from "../../DomainLayer/user/Subscriber";
import { subscriberDB } from "../dbs/SubscriberDB";
import { iSubscriberDB } from "../interfaces/iSubscriberDB";


export class SubscriberCache implements iSubscriberDB
{
    private subscribers: Map<number, [boolean, Subscriber]>
    private subscriberDb: iSubscriberDB;
    public constructor()
    {
        this.subscribers = new Map();
        this.subscriberDb = new subscriberDB();
    }

    private getSubscriber(userId: number): Promise<Subscriber>
    {
        if(this.subscribers.has(userId))
        {
            if(this.subscribers.get(userId)[0])
                return Promise.resolve(this.subscribers.get(userId)[1]);
        }
        let subscriberPromise = this.subscriberDb.getSubscriberById(userId);
        return new Promise((resolve, reject) =>
        {
            subscriberPromise
            .then(subscriber => 
                {
                    this.cacheSubscrbriber(subscriber);
                    resolve(subscriber);
                })
            .catch(e => reject(e))
        })
    }

    private cacheSubscrbriber(subscriber: Subscriber)
    {
        if(this.subscribers.size >= SUBSCRIBERS_CACHE_SIZE)
        {
            this.subscribers.delete(this.subscribers.keys().next().value)
        }
        this.subscribers.set(subscriber.getUserId(), [false, subscriber]);
    }

    private updateCache(userId: number): void 
    {
        if(this.subscribers.has(userId))
        {
            this.subscribers.get(userId)[0] = true;
        }
    }


    public getLastUserId(): Promise<number> {
        return this.subscriberDb.getLastUserId()
    }

    public addMessageToHistory (message: string, userId: number) : Promise<void>
    {
        let addMessagePromise = this.subscriberDb.addMessageToHistory(message, userId);
        return new Promise((resolve, reject) =>
        {
            addMessagePromise
            .then(() =>{
                this.updateCache(userId)
                resolve();
            })
            .catch( error => reject(error))
        })
    }

    public addSubscriber (username: string, password: string, age: number) : Promise<void>
    {
        return this.subscriberDb.addSubscriber(username, password, age);
    }
    public addSystemManager (subscriber: Subscriber) : Promise<void>
    {
        return this.subscriberDb.addSystemManager(subscriber)
    }
    public isSystemManager (userId: number): Promise<boolean>
    {
        return this.subscriberDb.isSystemManager(userId)
    }
    public addProductToCart (subscriberId: number, storeId: number, productId: number, quantity: number):Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            let addProductPromise =this.subscriberDb.addProductToCart(subscriberId, storeId, productId, quantity)
            .then(() =>{
                this.updateCache(subscriberId);
                resolve();
            })
            .catch(error => reject(error))
        })
    }
    public updateCart (subscriberId: number, storeId: number, productId: number, newQuantity: number):Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            let updatePromise = this.subscriberDb.updateCart(subscriberId, storeId, productId, newQuantity)
            .then(() =>
            {
                this.updateCache(subscriberId);
                resolve();
            })
            .catch(error => reject(error));
        })
    }
    public getSubscriberById (userId: number):Promise<Subscriber>
    {
        return this.getSubscriber(userId);
    }
    public getSubscriberByUsername (username: string): Promise<Subscriber>
    {
        for(let subscriber of this.subscribers.values())
        {
            if(subscriber[0])
            {
                if(subscriber[1].getUsername() === username)
                {
                    return Promise.resolve(subscriber[1]);
                }
            }
            else return this.subscriberDb.getSubscriberById(subscriber[1].getUserId());
        }
        return this.subscriberDb.getSubscriberByUsername(username);
    }

    public addAppointment (userId: number, appointment: Appointment):Promise<void>
    {
        return new Promise<void>((resolve, reject) =>{
            let addappointmentPromise = this.subscriberDb.addAppointment(userId, appointment)
            .then(() => {
                this.updateCache(userId);
                resolve()
            })
            .catch(error => reject(error))
        })
    }
    public getAppointment (userId: number, storeId: number):Promise<Appointment>
    {
        return new Promise((resolve,reject)=>{
            let getSubscriberPromise = this.getSubscriber(userId)
            .then(subsciber =>{
                resolve(subsciber.getStoreapp(storeId))
            })
            .catch(error => reject(error));
        })
    }
    public willFail ():void
    {
        this.subscriberDb.willFail();
    }
    public willSucceed ():void
    {
        this.subscriberDb.willSucceed();
    }
    public deleteBasket (userId: number, storeId: number): Promise<void>
    {
        return new Promise((resolve, reject) =>{
            let daleteBasketPromise = this.subscriberDb.deleteBasket(userId, storeId)
            .then(() => {
                this.updateCache(userId);
                resolve()
            })
            .catch(error => reject(error))
        })
    }
    public deleteAppointment (appointee: number, appointer: number, storeId: number):void
    {

        this.subscriberDb.deleteAppointment(appointee, appointer, storeId);
        this.updateCache(appointee);
        //TODO: update the store cache too!!
    }
    public addPendingMessage (userId: number, message: string):void
    {
        this.subscriberDb.addPendingMessage(userId, message);
        this.updateCache(userId);
    }
    public deletePendingMessages (userId: number):void
    {
        this.subscriberDb.deletePendingMessages(userId);
        this.updateCache(userId);
    }

    public updatePermission(storeId: number, managerToEditId: number, permissionMask: number): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            let updatePromise = this.subscriberDb.updatePermission(storeId, managerToEditId, permissionMask)
            .then(() =>
            {
                this.updateCache(managerToEditId)
                resolve()
            })
            .catch(error => reject(error))
        })
    }
    public clear(): void
    {
        for(let id of this.subscribers.keys())
        {
            this.subscribers.delete(id);
        }
        this.subscriberDb.clear()
    }
    
}