import { makeFailure, makeOk, Result } from "../../Result";
import { Logger } from "../Logger";
import { Authentication } from "./Authentication";
import { Subscriber } from "./Subscriber";


export class Login
{

    public static login(username: string, password: string) : Result<Subscriber>
    {
        if(Authentication.checkPassword(username, password))
        {
            return makeOk(Authentication.getSubscriberByName(username));
        }
        else
        {
            Logger.log(`user ${username} couldn't log in with the given password!`);
            return makeFailure(`user ${username} couldn't log in with the given password!`);
        }
    }
}