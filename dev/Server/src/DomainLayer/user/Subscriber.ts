import { DB } from "../../DataAccessLayer/DBfacade";
import { Logger } from "../../Logger";
import { tShippingInfo } from "../purchase/Purchase";
import { Store } from "../store/Store";
import { Appointment } from "./Appointment";
import { Authentication } from "./Authentication";
import { ACTION } from "./Permission";
import { ShoppingBasket } from "./ShoppingBasket";
import { ShoppingCart } from "./ShoppingCart";
import { SubscriberHistory } from "./SubscriberHistory";
import {  User } from "./User";


export class Subscriber extends User
{
    public static rebuildSubscriber(id:number, username: string, hashPassword: string, age: number, pending_messages: string[], appointments: Appointment[], shoppingCart: ShoppingCart): Subscriber
    {
        let sub: Subscriber = new Subscriber(username, hashPassword, age);
        sub.hashPassword = hashPassword;
        sub.pending_messages = pending_messages;
        sub.appointments = appointments;
        sub.shoppingCart = shoppingCart;
        sub.userId = id
        Logger.log(`rebuilt subscriber: ${JSON.stringify(sub)}`)

        return sub;
    }

    private username: string;
    private hashPassword: string;
    private age: number

    private appointments: Appointment[];
    private history: SubscriberHistory;
    private pending_messages: string[];
    private message_history: string[];

    public constructor(username: string, hashedPassword : string, age: number ){
        super();
        this.username = username;
        this.hashPassword = hashedPassword;
        this.age = age;
        this.appointments = [];
        this.pending_messages=[];
        this.message_history = [];
        this.history = new SubscriberHistory(this.userId)
    }

    static buildSubscriber(username: string, hashpassword: string, age: number): Subscriber {
        let subscriber: Subscriber = new Subscriber(username, hashpassword, age);
        return subscriber;
    }
    
    public addProductToShoppingCart(storeId: number,  productId: number, quantity: number) : Promise<ShoppingBasket>
    {
        let addp = this.shoppingCart.addProduct(storeId, productId, quantity);
        return new Promise ((resolve,reject) => {
            addp.then( shoppingbasket => {
                DB.addProductToCart(this.userId,storeId, productId, quantity);
                resolve(shoppingbasket)
            })
            .catch( error => reject(error))
        })
    }

    public setPassword(hashPassword: string){
        this.hashPassword = hashPassword;
    }


    public getUsername(): string
    {
        return this.username;
    }


    public getPassword(): string
    {
        return this.hashPassword;
    }

    public addAppointment(appointment: Appointment) : void
    {
        this.appointments.push(appointment);
        DB.addAppointment(this.getUserId(),appointment)
    }

    public checkoutBasket(storeId: number, shippingInfo: tShippingInfo): Promise<boolean>
    {
        let checkoutp = this.shoppingCart.checkoutBasket(this.getUserId(), this, storeId, shippingInfo, this);
        return new Promise((resolve,reject) => {
            checkoutp.then( isSusccesfull => {
                this.shoppingCart.getBaskets().delete(storeId);
                DB.deleteBasket(this.userId, storeId);
                resolve(isSusccesfull)
            })
            .catch( error => reject(error))
        })
    }

    // returns an appointments of current user to storeId if exists
    public getStoreapp(storeId : number) : Appointment
    {
        return this.appointments.find( appointment => appointment.getStoreId() === storeId);
    }

    //returns true if this subscriber can perform this <action> on this <store>
    public checkIfPerrmited(action : ACTION , store: Store) : boolean
    {
        let store_app : Appointment = this.getStoreapp(store.getStoreId());
        if (store_app != undefined)
            if (store_app.checkIfPermited(action))
                return true;
        return false;
    }

    public editCart(storeId: number, productId: number, quantity: number): Promise<string>
    {
        let editp = this.shoppingCart.editStoreCart(storeId, productId, quantity);
        return new Promise( (resolve,reject) => {
            editp.then ( msg => {
                DB.updateCart(this.userId, storeId, productId, quantity)
                resolve(msg)
            })
            editp.catch( error => {
                reject(error)
            })
        })
    }

    public deleteAppointment(store_app: Appointment) 
    {
        this.appointments = this.appointments.filter(app => app !== store_app);
        DB.deleteAppointment(store_app.appointee, store_app.appointer, store_app.store)
    }

    public isSystemManager(): Promise<boolean>
    {
        return Authentication.isSystemManager(this.userId);
    }

    isManager(storeId: number): boolean
    {
        let storeApp: Appointment = this.getStoreapp(storeId);
        if( storeApp !== undefined)
            return storeApp.isManager();
        return false;
    }
    
    isOwner(storeId: number): boolean
    {
        let storeApp: Appointment = this.getStoreapp(storeId);
        if (storeApp != undefined)
            return storeApp.isOwner();
        return false;
    }

    public addPendingMessage(message:string) : void
    {
        this.pending_messages.push(message);
        DB.addPendingMessage(this.getUserId() , message);
    }

    public addMessageToHistory(message: string) : void
    {
        DB.addMessageToHistory(message, this.getUserId())
        this.message_history.push(message)
    }

    getMessageHistory() : string[]
    {
        return this.message_history;
    }


    public getValue = (field: string): number => this.age;

    public isPendingMessages() : boolean
    {
        if (this.pending_messages.length === 0)
            return false;
        return true;
    }

    public takeMessages(): string[]
    {
        let messages = this.pending_messages;
        this.pending_messages = [];
        DB.deletePendingMessages(this.getUserId())
        return messages;
    }

    public async getStores() : Promise<{}>
    {
        Logger.log(`getting stores of user app: ${JSON.stringify(this.appointments)}`)
        let stores: Promise<{}>[] =[]
        this.appointments.forEach( appointment =>{
            stores.push( new Promise<{}>(async (resolve, reject) => {
                let storeName = (await DB.getStoreByID(appointment.getStoreId())).getStoreName()
                resolve({storeId: appointment.getStoreId(), storeName: storeName , permissions: appointment.getPermissions()})
            }))
        })

        return new Promise((resolve,reject) => {
                Promise.all(stores).then(s => {
                let jsonStores = JSON.stringify({stores:s})
                Logger.log(`stores of user: ${jsonStores}`)
                resolve(jsonStores)
                })
                .catch( error => reject(error))
        })
    }

    public getPurchaseHistory()
    {
        return this.history.getPurchaseHistory()
    }

    deleteShoppingBasket(storeId : number) : Promise<void>
    {
        this.shoppingCart.deleteShoppingBasket(storeId)
        return DB.deleteBasket(this.getUserId(), storeId);
    }
    
    public getPermission(storeId: number): number
    {   
        let appoint: Appointment = this.appointments.find(apppintment => apppintment.getStoreId() === storeId );
        if(appoint !== undefined)
        {
            return appoint.getPermissions().getPermissions();
        }
        return 0;
    }

    public getAge = ():number => this.age;

    //-----------------------------functions for tests---------------------------------------------
    public getAppointments() : Appointment[]
    {
        return this.appointments;
    }

    public getPendingMessages()
    {
        return this.pending_messages;
    }
}