import {Authentication} from "./Authentication"
export class Register
{

    public static register(username:string, password:string, age:number) : Promise<string> 
    {
        if (username === "")
            return new Promise ((resolve,reject) => reject("invalid username"))
        let used_usernamep = Authentication.checkedUsedUserName(username)
        return new Promise( (resolve,reject) => {
            used_usernamep.then( _ => {
                if (this.checkPassword(password)) {
                    //console.log(`register of ${username} with ${password} succeeded`)
                    Authentication.addSubscriber(username, password, age)
                    resolve("registered")
                }
                else 
                    //console.log(`register of ${username} with ${password} failed`)
                    reject("invalid password")
            })
            .catch( error => reject(error))
        })
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

    