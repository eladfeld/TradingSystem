/* 
    1) init and log in users
    2) open stores
        a) founder opens store
        b) founder recursively adds categories
        c) founder adds inventory of state + inventory from transactions
        d) appoint owners and managers
        e) add buying policy
        f) add discounts
    3) perform transactions
        a) add all products to cart
        b) purchase
    4) fill carts to state
    5) log out necesary users
*/


//import state from './InitialState';
import { INITIAL_STATE } from '../../config';
import { Service } from '../Service';

const BANK_ACCOUNT = 0;
const ADDRESS = "313 8 Mile Road, Detroit";
const ROOT_CATEGORY:any = null;
const AGE = 25;
const DEFAULT_PASSWORD = "123";

const state = INITIAL_STATE;

export default class StateInitializer{

    private users:Map<string, number>;
    private sessions:Map<string, string>;
    private stores:Map<string, number>;
    private products:Map<string, Map<string, number>>;

    constructor(){
        this.users = new Map();
        this.stores = new Map();
        this.products = new Map();
        this.sessions = new Map();
    }

    public initState = async() =>{
        try {
            const service: Service = Service.get_instance();
            await this.initAndLoginUsers(service);
            await this.openStores(service);
            // this.performTransactions(service);
            await this.fillCarts(service);
            // this.logoutUsers(service);
            
        } catch (error) {
            console.log(error);
            return false;
        }

        return true;

    }

    private initAndLoginUsers = async (service: Service) =>{
        //init subscribers
        for(var subIdx=0; subIdx<state.subscribers.length; subIdx++){
            const subState = state.subscribers[subIdx];
            const subName = subState.name;
            const sessionId = await service.enter();
            this.sessions.set(subName, sessionId);
            const pwd = subState.password ? subState.password : DEFAULT_PASSWORD;
            await service.register(subName, pwd, AGE );
            const subscriber = await service.login(sessionId,subState.name,pwd);
            this.users.set(subName, subscriber.getUserId());
        }
    }

    private openStores = async(service: Service) =>{
        for(var storeIdx=0; storeIdx<state.stores.length; storeIdx++){
            const storeState = state.stores[storeIdx];

            //open store
            const storeName = storeState.name;
            const founderName = storeState.founder;
            const founderId = this.users.get(founderName);
            const founderSessionId = this.sessions.get(founderName);
            const store = await service.openStore(founderSessionId,storeName, BANK_ACCOUNT, ADDRESS);

            const storeId = store.getStoreId();
            this.stores.set(storeName, storeId);
            this.products.set(storeName, new Map());

            //add categories
            const cats = storeState.categories;
            for(var i=0; i<cats.length; i++){
                await this.initCategory(service, founderSessionId, storeId, cats[i], ROOT_CATEGORY);
            }

            //init inventory (state inventory + inventory to be purchased)
            const items = storeState.inventory;
            for(var i=0; i<items.length; i++){
                const itemState = items[i];
                const quantityState = itemState.quantity;
                const quantityPurchased = this.getNumberOfPurchasedItem();
                const itemId = await service.addNewProduct(founderSessionId, storeId, itemState.name, itemState.categories, itemState.price, quantityState+quantityPurchased);
                this.products.get(storeName).set(itemState.name, itemId);
            }

            //appoint owners
            const owners = storeState.employees.owners;
            for(var i=0; i<owners.length; i++){
                const ownerState = owners[i];
                await service.appointStoreOwner(this.sessions.get(ownerState.appointer),storeId,ownerState.name);
            }


            //appoint managers
            const managers = storeState.employees.managers;
            for(var i=0; i<managers.length; i++){
                const appointerSessionId = this.sessions.get(managers[i].appointer);
                await service.appointStoreManager(appointerSessionId,storeId,managers[i].name);
                await service.editStaffPermission(appointerSessionId, this.users.get(managers[i].name), storeId, managers[i].permissions);
            }

            //add buying policy
            //convert fields
            storeState.buying_policies.forEach(policyState =>{
                this.convertPredicate(storeName, policyState.rule);
            });
            //add discounts
            //TODO: Implement
        }
}

    private performTransactions = (service: Service) =>{
        //TODO: Implement
    }

    private fillCarts = async(service: Service) => {

        for(var subIdx=0; subIdx<state.subscribers.length; subIdx++){
            const subState = state.subscribers[subIdx];
            const subSessionId = this.sessions.get(subState.name);
            for(var cartIdx=0; cartIdx<subState.cart.length; cartIdx++){
                const basketState = subState.cart[cartIdx];
                const storeName = basketState.store;
                const storeId = this.stores.get(storeName);
                for(var basketIdx=0; basketIdx<basketState.items.length; basketIdx++){
                    const productState = basketState.items[basketIdx];
                    const productId = this.products.get(storeName).get(productState.name);
                    await service.addProductTocart(subSessionId, storeId, productId,productState.quantity );
                }
            }
        }
    }

    private convertOperand = (storeName: string, op: string|number):string|number =>{
        if(typeof op === 'number') return op;
        
        const parts:string[] = op.split("_");
        for(var i=0; i<parts.length; i++){
            if(parts[i].startsWith("product:",0)){
                const pair = parts[i].split(":");
                const productName = pair[1];
                const productId = this.products.get(storeName).get(productName);
                parts[i] = `${productId}`;
            }
        }
        return parts.join("_");
    }

    private convertPredicate = (storeName: string, pred: any) =>{        
        if(pred.type === "simple"){
            pred.operand1 = this.convertOperand(storeName, pred.operand1);
            pred.operand2 = this.convertOperand(storeName, pred.operand2);
            
        }else{
            pred.operands.forEach((operand:any) => {
                operand =  this.convertPredicate(storeName, operand);
            });
        }
    }

    private logoutUsers = (service: Service) => {
        state.subscribers.forEach(subState => {
            if(!subState.logged_in){
                service.logout(`${this.users.get(subState.name)}`);
            }
        })
    }

    private initCategory = async (service: Service,founderId:string, storeId: number, cat:any, father:string) => {
        if(father == ROOT_CATEGORY) await service.addCategoryToRoot(founderId, storeId, cat.name);
        else await service.addCategory(founderId, storeId, father, cat.name );
        for(var i=0; i<cat.categories.length; i++){
            const subCat = cat.categories[i];
            await this.initCategory(service, founderId, storeId, subCat, cat.name)
        }
    }

    private getNumberOfPurchasedItem = ():number =>{
        return 0;
    }


    private syncForEach = <T,S>(arr:T[], f:(t:T)=>Promise<S>, g:(s:S)=>void, cont:()=>void):void =>{
        this.syncForEachRec(arr, f, g, 0, cont);
    }
    private syncForEachRec = <T,S>(arr:T[], f:(t:T)=>Promise<S>, g:(s:S)=>void, idx: number, cont:()=>void):void =>{
        if(idx === arr.length){
            cont();
        }
        f(arr[idx]).then(s =>{
            g(s);
            this.syncForEachRec(arr, f, g, idx+1, cont);
        })
    }

}