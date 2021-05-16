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

/*
constrainsts:
    owners must be listed after their appointer
    purchases dates will be the times of creation at runtime
    states dependent on appointment removal not supported
    states dependent on closing a store not supported
    guest users not supported

*/
import state from './InitialState';
import { Service } from './ServiceLayer/Service';

const BANK_ACCOUNT = 0;
const ADDRESS = "313 8 Mile Road, Detroit";
const ROOT_CATEGORY:any = null;

class StateInitializer{

    private users:Map<string, number>;
    private stores:Map<string, number>;
    private products:Map<string, Map<string, number>>;

    constructor(){
        this.users = new Map();
        this.stores = new Map();
        this.products = new Map();
    }

    public initState = ():boolean =>{
        try {
            const service: Service = Service.get_instance();
            this.initAndLoginUsers(service);
            this.openStores(service);
            this.performTransactions(service);
            this.fillCarts(service);
            this.logoutUsers(service);
            
        } catch (error) {
            return false;
        }

        return true;

    }

    public initAndLoginUsers = (service: Service) =>{
        //init subscribers
        state.users.subscribers.forEach(async subState => {
            const enterResp = JSON.parse(await service.enter());
            const userId: number = enterResp.data.userId;
            this.users.set(subState.name, userId);
            const registerResp = JSON.parse(await service.register(subState.name, subState.password, userId));
            const subscriber = await service.login(`${userId}`,subState.name,subState.password);
            //TODO: check if responses are bad and throw exception if bad
        });

        //init guests
        state.users.guests.forEach(async guestState => {
            const enterResp = JSON.parse(await service.enter());
            const userId: number = enterResp.data.userId;
            //TODO: check if responses are bad and throw exception if bad
        });
    }

    public openStores = async (service: Service) =>{
        state.stores.forEach(async storeState =>{
            //open store
            const storeName = storeState.name;
            const founderName = storeState.founder;
            const founderId = this.users.get(founderName);
            const founderIdStr = `${founderId}`;
            const store = await service.openStore(founderIdStr,storeName, BANK_ACCOUNT, ADDRESS);
            const storeId = store.getStoreId();
            this.stores.set(storeName, storeId);
            this.products.set(storeName, new Map());

            //add categories
            storeState.categories.forEach(cat => this.initCategory(service, founderIdStr, storeId, cat, ROOT_CATEGORY));

            //init inventory (state inventory + inventory to be purchased)
            storeState.inventory.forEach(async itemState => {
                const quantityState = itemState.quantity;
                const quantityPurchased = this.getNumberOfPurchasedItem();
                const itemId = await service.addNewProduct(founderIdStr, storeId, itemState.name, itemState.categories, itemState.price, quantityState+quantityPurchased);
                this.products.get(storeName).set(itemState.name, itemId);
            });

            //appoint owners
            storeState.employees.owners.forEach(ownerState =>{
                service.appointStoreOwner(`${this.users.get(ownerState.appointer)}`,storeId,ownerState.name);
            });

            //appoint managers
            storeState.employees.managers.forEach(managerState =>{
                const appointerIdStr = `${this.users.get(managerState.appointer)}`;
                service.appointStoreManager(appointerIdStr, storeId, managerState.name)
                .then(v => service.editStaffPermission(appointerIdStr, this.users.get(managerState.name), storeId, managerState.permissions));
            });

            //add buying policy
            //TODO: Implement

            //add discounts
            //TODO: Implement
        });
    }

    private performTransactions = (service: Service) =>{
        //TODO: Implement
    }

    private fillCarts = (service: Service) => {
        state.users.subscribers.forEach(subState =>{
            const subId = this.users.get(subState.name);
            subState.cart.forEach(basketState =>{
                const storeName = basketState.store;
                const storeId = this.stores.get(storeName);
                basketState.items.forEach(productState =>{
                    const productId = this.products.get(storeName).get(productState.name);
                    service.addProductTocart(`${subId}`, storeId, productId,productState.quantity );
                })
            })
        });
    }

    private logoutUsers = (service: Service) => {
        state.users.subscribers.forEach(subState => {
            if(!subState.logged_in){
                service.logout(`${this.users.get(subState.name)}`);
            }
        })
    }

    private initCategory = async (service: Service,founderId:string, storeId: number, cat:any, father:string) => {
        const response = await service.addCategory(founderId, storeId, cat.name, father );
        cat.categories.forEach((subCat: any) => {
            this.initCategory(service, founderId, storeId, subCat, cat.name);
        });
    }

    private getNumberOfPurchasedItem = ():number =>{
        return 0;
    }
}