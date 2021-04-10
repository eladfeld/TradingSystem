import { Logger } from "../Logger";
import { SubscriberData } from "./Authentication";
import {User} from "./User"


export class Login
{

    public static login(username: string, password: string) : User
    {
        if(SubscriberData.checkPassword(username, password))
        {
            Logger.log(`user ${username} is succefully logged in!`);
            return SubscriberData.getSubscriber(username);
        }
        else
        {
            Logger.log(`user ${username} couldn't log in with the given password!`);
            return null;
        }
    }
}