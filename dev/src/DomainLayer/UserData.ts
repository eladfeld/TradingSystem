import {User} from './User'

export class UserData
{
    private static users: User[]  = [];

    public static addUser(u: User): void
    {
        this.users.push(u);
    }
    public static clean(): void
    {
        this.users = [];
    }

    public static UsernameExist(username: string): boolean
    {
        return this.users.some( user => user.getUsername() === username )
    }

    public static getUser(username: string): User
    {
        return this.users.find(user => user.getUsername() === username);
    }

    public static checkPassword(username: string, password: string) :boolean
    {
        return this.users.some( user => user.getUsername() === username && user.getPassword() === password )
    }

}