import { createHash } from 'crypto';
import { subscriberDB } from '../../DataAccessLayer/DBinit';
import { Logger } from '../../Logger';
import { Subscriber } from './Subscriber'; 

export class Authentication
{
    // private static subscribers: Subscriber[]  = [];
    // private static system_managers : Subscriber[] = [];
    
    public static addSystemManager(sys_manager : Subscriber):void
    {
        subscriberDB.addSystemManager(sys_manager);
    }

    public static isSystemManager(userId : number) : Promise<boolean>
    {
        return subscriberDB.isSystemManager(userId);
    }

    public static addSubscriber(username:string , password:string, age : number): void
    {
        let hashedPass : string = createHash('sha1').update(password).digest('hex');
        subscriberDB.addSubscriber(username, hashedPass, age)
    }    

    public static checkedUsedUserName(username: string): Promise<boolean>
    {
        let subp = subscriberDB.getSubscriberByUsername(username)
        return new Promise( (resolve,reject) => {
            subp.then( _ => {
                reject("checkedUsedUserName:used username");
            })
            .catch( _ => {
                resolve(true)
            })
        })
    }

    public static getSubscriberByName(username: string): Promise<Subscriber>
    {
        return subscriberDB.getSubscriberByUsername(username);
    }

    public static getSubscriberById(userId: number): Promise<Subscriber>
    {
        return subscriberDB.getSubscriberById(userId);
    }

    public static checkPassword(username: string, password: string) : Promise<boolean>
    {
        let hashedPass : string = createHash('sha1').update(password).digest('hex');
        let subscriberp = subscriberDB.getSubscriberByUsername(username);
        return new Promise( (resolve,reject) => {
            subscriberp.then( subscriber =>{
                if ( subscriber.getPassword() == hashedPass)
                    resolve(true);
                else reject("checkPassword: password doesnt match")
            })
            .catch( error => {
                reject(error)
            })
        })
    }

}