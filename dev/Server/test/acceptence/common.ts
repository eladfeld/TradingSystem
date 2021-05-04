import { Store } from "../../src/DomainLayer/store/Store";
import { Subscriber } from "../../src/DomainLayer/user/Subscriber";
import { isOk } from "../../src/Result";
import { Service } from "../../src/ServiceLayer/Service";

//this function performs: enter->register->login and returns the subscriber object
export async function enter_register_login(service :Service , userName:string, password : string) : Promise<Subscriber>
{
    let id =await service.enter();
    service.register(userName,password,13);
    let subscriber =await service.login(id, userName, password);
    return subscriber;

}

//this function performs: enter->login and returns the subscriber object
//this function is for system managers since they dont need to register
export async function enter_login(service :Service , userName:string, password : string) : Promise<Subscriber>
{
    let userId =await service.enter();
    let subscriber =await service.login(userId, userName, password);
    return subscriber;

}

export async function open_store(service:Service ,founder : Subscriber , name:string, accountNumber : number , storeAddress : string) : Promise<Store>
{

    let store =await service.openStore(founder.getUserId(), name, accountNumber, storeAddress);
    return store;
}

export async function add_product(service : Service, user:Subscriber ,store : Store, productName: string, categories: string[], price: number, quantity?: number) : Promise<number>
{
    let product = await service.addNewProduct(user.getUserId() , store.getStoreId() ,productName , categories , price , quantity);
    return product;

}

