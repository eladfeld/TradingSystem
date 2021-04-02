


export class User
{
    private username: string;
    private password: string;

    public constructor(username: string, password: string){
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