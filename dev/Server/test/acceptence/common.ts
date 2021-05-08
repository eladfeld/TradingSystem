import { Store } from "../../src/DomainLayer/store/Store";
import { Subscriber } from "../../src/DomainLayer/user/Subscriber";
import { isOk } from "../../src/Result";
import { Service } from "../../src/ServiceLayer/Service";

//this function performs: enter->register->login and returns the subscriber object
export async function register_login(service :Service , sessionId:string , userName:string, password : string) : Promise<Subscriber>
{
    service.register(userName,password,13);
    let subscriber =await service.login(sessionId, userName, password);
    return subscriber;

}

//this function performs: enter->login and returns the subscriber object
//this function is for system managers since they dont need to register
export async function enter_login(service :Service , userName:string, password : string) : Promise<Subscriber>
{
    let sessionId =await service.enter();
    let subscriber =await service.login(sessionId, userName, password);
    return subscriber;

}

export async function open_store(service:Service , sessionId:string , founder : Subscriber , name:string, accountNumber : number , storeAddress : string) : Promise<Store>
{

    let store =await service.openStore(sessionId, name, accountNumber, storeAddress);
    return store;
}

export async function add_product(service : Service , sessionId:string, user:Subscriber ,store : Store, productName: string, categories: string[], price: number, quantity?: number) : Promise<number>
{
    let product = await service.addNewProduct(sessionId , store.getStoreId() ,productName , categories , price , quantity);
    return product;

}

