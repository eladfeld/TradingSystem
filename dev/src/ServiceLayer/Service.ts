import { Logger } from "../DomainLayer/Logger";
import { Login } from "../DomainLayer/user/Login";
import { Register } from "../DomainLayer/user/Register";
import { Subscriber } from "../DomainLayer/user/Subscriber";
import { User } from "../DomainLayer/user/User";
import { makeFailure, makeOk, Result } from "../Result";


export class Service
{
    private static singletone: Service = undefined;
    private systemManagers : User[];
    private logged_users : User[];
    
    public static get_instance() : Service
    {
        if (Service.singletone === undefined)
        {
            Service.singletone = new Service();
            return Service.singletone;
        }
        return Service.singletone;
    }
    
    private constructor()
    {
        this.initPaymentSystem();
        this.initSupplySystem();
        this.initSystemManagers();
        this.logged_users = [];
    }

    private initSupplySystem() : boolean
    {
        return true;
    }
    
    private initPaymentSystem() : boolean
    {
        return true;
    }
    
    private initSystemManagers() : boolean
    {
        return true
    }

    //user enter the system
    public enter(): number
    {
        Logger.log("new user entered the system");
        let user: User = new User();
        this.logged_users.push(user);
        return user.getUserId();
    }

    public exit(userId: number): void
    {
        this.logged_users = this.logged_users.filter(user => user.getUserId() !== userId);
    }

    public register(username: string, password: string): Result<string>
    {
        return Register.register(username, password);
        
    }

    public login(username: string, password: string): Result<Subscriber>
    {
        //TODO: need to change the result and replace the subscriber with the user exists in the system.
        return Login.login(username, password);
    }

}