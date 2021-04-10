import { Logger } from "./Logger"
import {SubscriberData} from "./UserData"
import {User} from "./User";
export class Register
{

    public static register(username:string, password:string) : boolean 
    {
        if (!SubscriberData.checkedUsedUserName(username)){
            if (this.checkPassword(password)){
                Logger.log(`Guest user ${username} registered successfully `);
                SubscriberData.addSubscriber(new User(username,password));
                return true;
            }
            else{
                Logger.log(`Guest user tries to register with invalid password`)
                return false;
            }
        }
        else{
            Logger.log(`Guest user tried to register with used username ${username}`);
            return false;
        }
    }

    private static checkPassword(password : string) : boolean
    {
        return true;
    }

}

    