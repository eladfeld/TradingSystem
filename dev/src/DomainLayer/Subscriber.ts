import { User } from "./User";


export class Subscriber extends User
{
    private username: string;
    private password: string;
    
    public constructor(username: string, password: string){
        super();
        this.username = username;
        this.password = password;
    }
    


    public getUsername(): string
    {
        return this.username;
    }


    public getPassword(): string
    {
        return this.password;
    }


    public printUser(): string
    {
        return `username: ${this.username} password: ${this.password}`
    }
}