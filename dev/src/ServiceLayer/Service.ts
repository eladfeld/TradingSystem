import { Logger } from "../DomainLayer/Logger";
import { Login } from "../DomainLayer/user/Login";
import { Register } from "../DomainLayer/user/Register";
import { Subscriber } from "../DomainLayer/user/Subscriber";
import { User } from "../DomainLayer/user/User";
import { isFailure, makeFailure, makeOk, Result } from "../Result";


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
    public enter(): Result<number>
    {
        Logger.log("new user entered the system");
        let user: User = new User();
        this.logged_users.push(user);
        return makeOk(user.getUserId());
    }

    public exit(userId: number): void
    {
        this.logged_users = this.logged_users.filter(user => user.getUserId() !== userId);
    }

    public register(username: string, password: string): Result<string>
    {
        return Register.register(username, password);
    }

    public login(userId: number, username: string, password: string): Result<number>
    {
        let res: Result<Subscriber> =  Login.login(username, password);
        if (isFailure(res))
        {
            return makeFailure(res.message);
        }
        let sub : Subscriber = res.value;
        this.logged_users = this.logged_users.map(user => user.getUserId() === userId ? sub : user);
        return makeOk(sub.getUserId());
    }

    public getStoreInfo(storeId: number): Result<string>
    {
        //TODO: forowrd to the stores system and return a json representation of the store
        return makeFailure("not yet implemented");
    }

    public getPruductInfo(): Result<string>
    {   
        //TODO: forowrd to the stores system and return a json representation of the store
        return makeFailure("not yet implemented");
    }

    public addProductTocart(userId: number, storeId: number, productId: number, quantity: number): Result<string>
    {
        let user: User = this.logged_users.find(user => user.getUserId() === userId);
        return user.addProductToShoppingCart(storeId, productId, quantity);
    }

    public getCartInfo(userId: number): Result<string>
    {
        let user: User = this.logged_users.find(user => user.getUserId() === userId);
        return user.GetShoppingCart();
    }


    //------------------------------------------functions for tests-------------------------
    public getLoggedUsers() : User[] 
    {
        return this.logged_users;
    }

    public clear() : void
    {
        this.logged_users = [];
    }

}