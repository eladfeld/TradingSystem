import { User } from "./User";


export class Subscriber extends User
{
    private username: string;
    private hashPassword: string;
    
    public constructor(username: string){
        super();
        this.username = username;
    }
    

    public setPassword(hashPassword: string){
        this.hashPassword = hashPassword;
    }


    public getUsername(): string
    {
        return this.username;
    }


    public getPassword(): string
    {
        return this.hashPassword;
    }


    public printUser(): string
    {
        return `username: ${this.username}`
    }
}