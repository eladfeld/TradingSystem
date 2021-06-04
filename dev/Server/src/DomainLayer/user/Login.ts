import { subscriberDB } from "../../DataAccessLayer/DBinit";
import { Authentication } from "./Authentication";
import { Subscriber } from "./Subscriber";


export class Login
{

    public static login(username: string, password: string) : Promise<Subscriber>
    {
        let pass_check =  Authentication.checkPassword(username, password)
        return new Promise ((resolve,reject) => {
            pass_check.then( valid_pass => {
                if(valid_pass)
                    resolve(subscriberDB.getSubscriberByUsername(username))
                else
                    reject("login : invalid password")
            })
            .catch ( error => reject(error))
        })
    }
}