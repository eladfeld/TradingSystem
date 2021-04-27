import { Subscriber } from "../user/Subscriber";


export class Messenger
{
    private static singleton : Messenger = undefined;
    private send_message_func : (userId : number, message:{}) => Promise<number>;
    private store_subscribers:Map<number,Subscriber[]>; //key=storeId , value = registered subscribers

    private constructor() 
    {
        this.store_subscribers = new Map();
        this.send_message_func= (userId : number, message:{}) => {throw 'send func not set yet'};
    }

    public set_send_func(send_message : (userId : number, message:{}) => Promise<number>) : void
    {
        Messenger.singleton.send_message_func = send_message;
    }

    public static get_instance()
    {
        if (Messenger.singleton === undefined)
        {
            Messenger.singleton = new Messenger();
        }
        return Messenger.singleton;
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

    public send_message(subscriber:Subscriber , message:{}) : void
    {
        let promise = this.send_message_func(subscriber.getUserId() , message);
        promise.catch( reason => subscriber.addMessage(message))
    }

    //----------------------------------functions for tests--------------------------------
    public get_store_subscribers() {
        return this.store_subscribers;
    }

}
