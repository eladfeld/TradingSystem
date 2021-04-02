import { Logger } from "./Logger";
import { UserData } from "./UserData";
import {User} from "./User"


export class Login
{

    public static login(username: string, password: string) : User
    {
        if(UserData.checkPassword(username, password))
        {
            Logger.log(`user ${username} is succefully logged in!`);
            return UserData.getUser(username);
        }
        else
        {
            Logger.log(`user ${username} couldn't log in with the given password!`);
            return null;
        }
    }
}