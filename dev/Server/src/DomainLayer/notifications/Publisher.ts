import { Subscriber } from "../user/Subscriber";


export class Publisher
{
    private static singleton : Publisher = undefined;
    private send_message_func : (userId : number, message:{}) => Promise<number>;
    private store_subscribers:Map<number,Subscriber[]>; //key=storeId , value = registered subscribers

    private constructor() 
    {
        this.store_subscribers = new Map();
    }

    public set_send_func(send_message : (userId : number, message:{}) => Promise<number>) : void
    {
        Publisher.singleton.send_message_func = send_message;
    }

    public static get_instance()
    {
        if (Publisher.singleton === undefined)
        {
            Publisher.singleton = new Publisher();
            Publisher.singleton.send_message_func= (userId : number, message:{}) => {throw 'send func not set yet'};
        }
        return Publisher.singleton;
    }

    public register_store(storeId:number, subscriber: Subscriber) : void
    {
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

    public unregister_store(storeId:number, sub_to_delete:Subscriber) : void
    {
        let registered = this.store_subscribers.get(storeId);
        let deleted_user = registered.filter( sub => sub.getUserId() !== sub_to_delete.getUserId());
        this.store_subscribers.set(storeId , deleted_user);
    }

    private send_message(subscriber:Subscriber , message:{}) : Promise<void>
    {
        return new Promise( (resolve,reject) => {
            let promise = this.send_message_func(subscriber.getUserId() , message);

            // if fail message failed add message to subscriber queue
            promise.catch( reason => {  
                subscriber.addMessage(message);
                resolve();
                return;
            })
        })
    
    }

    public notify_store_update(storeId : number , message:{}) : Promise<void>[]
    {
        let subscribers = this.store_subscribers.get(storeId);
        let promises : Promise<void>[] = [];
        subscribers.forEach(subscriber => { 
            let promise = this.send_message(subscriber,message)
            promises.push(promise)
        });
        return promises;
    }

    public send_pending_messages(subscriber : Subscriber) : Promise<void>[]
    {
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
