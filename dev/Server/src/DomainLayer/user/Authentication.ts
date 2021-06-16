import { createHash } from 'crypto';
import { DB } from '../../DataAccessLayer/DBfacade';
import { Subscriber } from './Subscriber'; 

export class Authentication
{
    // private static subscribers: Subscriber[]  = [];
    // private static system_managers : Subscriber[] = [];
    
    public static addSystemManager(sys_manager : Subscriber): Promise<void>
    {
        return DB.addSystemManager(sys_manager);
    }

    public static isSystemManager(userId : number) : Promise<boolean>
    {
        return DB.isSystemManager(userId);
    }

    public static addSubscriber(username:string , password:string, age : number): Promise<void>
    {
        let hashedPass : string = createHash('sha1').update(password).digest('hex');
        return DB.addSubscriber(username, hashedPass, age)
    }    

    public static checkedUsedUserName(username: string): Promise<boolean>
    {
        let subp = DB.getSubscriberByUsername(username)
        return new Promise( (resolve,reject) => {
            subp.then( msg => {
                reject(msg);
            })
            .catch( _ => {
                resolve(true)
            })
        })
    }

    public static getSubscriberByName(username: string): Promise<Subscriber>
    {
        return DB.getSubscriberByUsername(username);
    }

    public static getSubscriberById(userId: number): Promise<Subscriber>
    {
        return DB.getSubscriberById(userId);
    }

    public static checkPassword(username: string, password: string) : Promise<boolean>
    {
        let hashedPass : string = createHash('sha1').update(password).digest('hex');
        let subscriberp = DB.getSubscriberByUsername(username);
        return new Promise( (resolve,reject) => {
            subscriberp.then( subscriber =>{
                if ( subscriber.getPassword() == hashedPass)
                    resolve(true);
                else reject("username or password is invalid")
            })
            .catch( error => {
                reject(error)
            })
        })
    }

}