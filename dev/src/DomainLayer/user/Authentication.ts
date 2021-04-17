import { createHash } from 'crypto';
import { Logger } from '../Logger';
import { Subscriber } from './Subscriber'; 

export class Authentication
{
    private static subscribers: Subscriber[]  = [];
    private static system_managers : Subscriber[] = [];
    
    public static addSystemManager(sys_manager : Subscriber):void
    {
        this.subscribers.push(sys_manager);
        this.system_managers.push(sys_manager);
    }

    public static isSystemManager(userId : number) : boolean
    {
        let system_manager : Subscriber = this.system_managers.find( user => user.getUserId() === userId);
        if (system_manager !== undefined )
            return true;
        return false;
    }

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