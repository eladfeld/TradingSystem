import { Subscriber } from './Subscriber'; 
var CryptoJS = require("crypto-js");

export class SubscriberData
{
    private static subscribers: Subscriber[]  = [];

    public static addSubscriber(subscriber: Subscriber , password:string): void
    {
        var hashed_pass : string = CryptoJS.createHash('sha1').update(password).digest('hex');
        subscriber.setPassword(hashed_pass);
        this.subscribers.push(subscriber);
    }
    public static clean(): void
    {
        this.subscribers = [];
    }

    public static checkedUsedUserName(username: string): boolean
    {
        return this.subscribers.some( user => user.getUsername() === username )
    }

    public static getSubscriber(username: string): Subscriber
    {
        return this.subscribers.find(user => user.getUsername() === username);
    }

    public static checkPassword(username: string, password: string) :boolean
    {
        return this.subscribers.some( user => user.getUsername() === username && user.getPassword() === password )
    }

}