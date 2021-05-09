import { makeFailure, makeOk, Result } from "../../Result";
import { Logger } from "../../Logger"
import {Authentication} from "./Authentication"
import { Subscriber } from "./Subscriber";
export class Register
{

    public static register(username:string, password:string, age:number) : Result<string> 
    {
        if (username === "")
            return makeFailure("invalid username")
        if (!Authentication.checkedUsedUserName(username)){
            if (this.checkPassword(password)){
                Authentication.addSubscriber(new Subscriber(username, age),password);
                return makeOk("user registered sucessfully");
            }
            else{
                return makeFailure("invalid password");
            }
        }
        else{
            return makeFailure(`used username ${username}`)
        }
    }

    //function to check password rules if any (e.g at least 1 number)
    private static checkPassword(password : string) : boolean
    {
        if(password === undefined)
            return false
        if(password === "")
            return false
        return true
    }

}

    