import { Store } from "../../src/DomainLayer/store/Store";
import { Subscriber } from "../../src/DomainLayer/user/Subscriber";
import { isOk } from "../../src/Result";
import { Service } from "../../src/ServiceLayer/Service";

//this function performs: enter->register->login and returns the subscriber object
export function enter_register_login(service :Service , userName:string, password : string) : Subscriber
{
    let userId = service.enter();
    if (isOk(userId))
    {
        service.register(userName,password);
        let user = service.login(userId.value, userName, password);
        if (isOk(user))
        {
            return user.value;
        }
    }
}

//this function performs: enter->login and returns the subscriber object
//this function is for system managers since they dont need to register
export function enter_login(service :Service , userName:string, password : string) : Subscriber
{
    let userId = service.enter();
    if (isOk(userId))
    {
        let user = service.login(userId.value, userName, password);
        if (isOk(user))
        {
            return user.value;
        }
    }
}

export function open_store(service:Service ,founder : Subscriber , name:string, accountNumber : number , storeAddress : string) : Store
{

    let store = service.openStore(founder.getUserId(), name, accountNumber, storeAddress);
    if(isOk(store))
    {
        return store.value;
    }
}

export function add_product(service : Service, user:Subscriber ,store : Store, productName: string, categories: number[], price: number, quantity?: number) : number
{
    let product = service.addNewProduct(user.getUserId() , store.getStoreId() ,productName , categories , price , quantity);
    if (isOk(product))
    {
        return product.value;
    }
    
}

