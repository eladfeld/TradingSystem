import { createHash } from 'crypto';
import { Logger } from '../Logger';
import { Subscriber } from './Subscriber'; 

export class SubscriberData
{
    private static subscribers: Subscriber[]  = [];

    public static addSubscriber(subscriber: Subscriber , password:string): void
    {
        let hashedPass : string = createHash('sha1').update(password).digest('hex');
        subscriber.setPassword(hashedPass);
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
        let hashedPass : string = createHash('sha1').update(password).digest('hex');
        return this.subscribers.some( user => user.getUsername() === username && user.getPassword() === hashedPass )
    }

}