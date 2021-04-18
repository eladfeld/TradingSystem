import { makeFailure, makeOk, Result } from "../../Result";
import { Logger } from "../Logger"
import {Authentication} from "./Authentication"
import { Subscriber } from "./Subscriber";
export class Register
{

    public static register(username:string, password:string) : Result<string> 
    {
        if (!Authentication.checkedUsedUserName(username)){
            if (this.checkPassword(password)){
                Authentication.addSubscriber(new Subscriber(username),password);
                return makeOk("user registered sucessfully");
            }
            else{
                return makeFailure("Guest user tries to register with invalid password");
            }
        }
        else{
            return makeFailure(`Guest user tried to register with used username ${username}`)
        }
    }

    //function to check password rules if any (e.g at least 1 number)
    private static checkPassword(password : string) : boolean
    {
        return true;
    }

}

    