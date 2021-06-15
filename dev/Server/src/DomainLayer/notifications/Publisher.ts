import { Logger } from "../../Logger";
import { Subscriber } from "../user/Subscriber";


export class Publisher
{
    private static singleton : Publisher = undefined;
    private send_message_func : (userId : number, message:string) => Promise<string>;
    private store_subscribers:Map<number,Subscriber[]>; //key=storeId , value = registered subscribers
    private login_subscribers: Subscriber[]; // subscribers(system managers) that needs to get notified when someone logins for login_stats

    private constructor()
    {
        this.store_subscribers = new Map();
        this.login_subscribers = []
    }

    public set_send_func(send_message : (userId : number, message:string) => Promise<string>) : void
    {
        Publisher.singleton.send_message_func = send_message;
    }

    public static get_instance()
    {
        if (Publisher.singleton === undefined)
        {
            Publisher.singleton = new Publisher();
            //Publisher.singleton.send_message_func= (userId : number, message:{}) => {throw 'send func not set yet'};
            Publisher.singleton.send_message_func= (userId : number, message:{}) => {return Promise.resolve('just testing')};
        }
        return Publisher.singleton;
    }

    // register to login events for login_stats
    public register_login(sys_manager : Subscriber) : void
    {
        Logger.log(`Publisher.register_login sys_manager:${sys_manager.getUsername()} `)
        this.login_subscribers.push(sys_manager)
    }

    // start listening to messages about this store
    public register_store(storeId:number, subscriber: Subscriber) : void
    {
        Logger.log(`Publisher.register_store storeId:${storeId} , subscriber:${subscriber}`)
        let registered: Subscriber[] = this.store_subscribers.get(storeId);
        if (registered === undefined)
        {
            this.store_subscribers.set(storeId,[subscriber]);
        }
        else
        {
            if (!registered.filter( sub => sub.getUserId() === subscriber.getUserId()))
                registered.push(subscriber);
            this.store_subscribers.set(storeId,registered);
        }
    }

    public unregister_login(sys_manager : Subscriber) : void
    {
        this.login_subscribers = this.login_subscribers.filter(sub => sub.getUserId() !== sys_manager.getUserId());
    }

    // stop listening to messages for this store
    public unregister_store(storeId:number, sub_to_delete:Subscriber) : void
    {
        Logger.log(`Publisher.unregister_store storeId:${storeId} , sub_to_delete:${sub_to_delete.getUserId()}`)
        let registered = this.store_subscribers.get(storeId);
        let deleted_user = registered.filter( sub => sub.getUserId() !== sub_to_delete.getUserId());
        this.store_subscribers.set(storeId , deleted_user);
    }

    public notify_login_update(msg : string) : Promise<void>[]
    {
        Logger.log(`Publisher.notify_login_update message:${msg} `)
        let promises : Promise<void>[] = [];
        this.login_subscribers.forEach( sys_manager => {
            let promise = this.send_message(sys_manager, msg)
            promises.push(promise)
        })
        return promises;
    }

    // ask the publisher to deliver a message to all listening clients
    public notify_store_update(storeId : number , message:string) : Promise<void>[]
    {
        Logger.log(`Publisher.notify_store_update  storeId:${storeId} , message:${message} `)
        let promises : Promise<void>[] = [];
        let subscribers = this.store_subscribers.get(storeId);
        if (subscribers !== undefined)
        {
            subscribers.forEach(subscriber => {
                let promise = this.send_message(subscriber,message)
                promises.push(promise)
            });
        }
        return promises;
    }



    //send message to specific subscriber
    public send_message(subscriber:Subscriber , message:string) : Promise<void>
    {
        Logger.log(`Publisher.send_message to sub_name:${subscriber.getUsername()}  sub_id:${subscriber.getUserId()} , message:${message} `)
        return new Promise( (resolve,reject) => {
            let promise = this.send_message_func(subscriber.getUserId() , message);

            // if fail message failed add message to subscriber pending messages queue
            promise.then( _ => {
                subscriber.addMessageToHistory(message)
            }).
            catch( reason => {
                Logger.log(`publisher: can't send message, ${subscriber.getUsername()} is not logged in`);
                subscriber.addPendingMessage(message);
                resolve();
                return;
            })
        })
    }

    //when user is logging in we need to send him his pending messages
    public send_pending_messages(subscriber : Subscriber) : Promise<void>[]
    {
        Logger.log(`Publisher.send_pending_messages  subscriber:${subscriber.getUsername()} `)
        let messages = subscriber.takeMessages();
        let promises : Promise<void>[] = [];
        messages.forEach(message => {
            let promise = this.send_message(subscriber,message);
            promises.push(promise);
        });
        return promises;
    }

    //----------------------------------functions for tests--------------------------------
    public get_store_subscribers(storeId : number) {
        return this.store_subscribers.get(storeId);
    }

    public clear(){
        this.store_subscribers = new Map();
    }

}
