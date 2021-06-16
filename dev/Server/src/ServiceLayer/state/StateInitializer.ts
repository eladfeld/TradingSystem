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
import { errorMonitor } from 'events';
import { INITIAL_STATE } from '../../../config';
import ConditionalDiscount from '../../DomainLayer/discount/ConditionalDiscount';
import { StoreCategoryInfo } from '../../DomainLayer/store/StoreInfo';
import { Service } from '../Service';
import Purchase, { tPaymentInfo, tShippingInfo } from '../../DomainLayer/purchase/Purchase';
import { basketState, discountState, predState, PRODUCT_PREF } from './StateBuilder';

const BANK_ACCOUNT = 0;
const SHIPPING_INFO : tShippingInfo = {name: "shir", address: "313 8 Mile Road" , city:"Detroit", country:"Michigan" , zip:3553}
const ADDRESS = SHIPPING_INFO.address;      //might need to replace with tShippingInfo
const ROOT_CATEGORY:any = null;
const AGE = 25;
const DEFAULT_PASSWORD = "123";
const PAYMENT_INFO : tPaymentInfo = { holder: "shir" , id:2080, cardNumber:123, expMonth:5, expYear:2024, cvv:123, toAccount: 1, amount: 100};

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
            const service: Service = await Service.get_instance();
            await this.initAndLoginUsers(service);
            await this.openStores(service);
            await this.performTransactions(service);
            await this.fillCarts(service);
            await this.logoutUsers(service);
            return true;
            
        } catch (error) {
            //throw error;
            return false;
        }
    }

    private initAndLoginUsers = async (service: Service) =>{
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

            //init inventory (state inventory + inventory purchased + inventory in baskets)
            const items = storeState.inventory;
            for(var i=0; i<items.length; i++){
                const itemState = items[i];
                const quantityState = itemState.quantity;
                const quantityPurchased = this.getQuantityInHistory(storeName, itemState.name);
                const quantityInCarts = this.getQuantityInCarts(storeName, itemState.name);
                const totalQuantity = quantityState + quantityPurchased + quantityInCarts;
                const image = "https://osemcat.signature-it.com/images/Fittings/osem-hq/Upload_Pictures/Prod_Pic/6901353/Catalog/6901353_7290000068787_L_1_Enlarge.jpg";
                const itemId = await service.addNewProduct(founderSessionId, storeId, itemState.name, itemState.categories, itemState.price, totalQuantity, image);
                this.products.get(storeName).set(itemState.name, itemId);
            }

            //appoint owners
            const owners = storeState.employees.owners;
            for(var i=0; i<owners.length; i++){
                const ownerState = owners[i];
                this.sessions.get(ownerState.appointer),storeId,ownerState.name;
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
            for(var pIdx=0; pIdx<storeState.buying_policies.length; pIdx++){
                const policy = storeState.buying_policies[pIdx];
                await service.addBuyingPolicy(founderSessionId, storeId, policy.name, policy.rule); 
            }

            //add discounts
            storeState.discounts.forEach(discount => {
                this.convertDiscount(storeName, discount.discount);
            })
            for(var dIdx=0; dIdx<storeState.discounts.length; dIdx++){
                const discount = storeState.discounts[dIdx];
                await service.addDiscountPolicy(founderSessionId, storeId,discount.name, discount.discount); 
            }


        }
}

    private performTransactions = async (service: Service) =>{
        for(var tIdx=0; tIdx<state.history.length; tIdx++){
            const {basket, store, user} = state.history[tIdx];
            const sessionId = this.sessions.get(user);
            const storeId = this.stores.get(store);
            for(var itemIdx=0; itemIdx<basket.length; itemIdx++){
                const {name, quantity} = basket[itemIdx];
                const productId = this.products.get(store).get(name);
                await service.addProductTocart(sessionId, storeId, productId,quantity );
            }
            await service.checkoutBasket(sessionId, storeId, SHIPPING_INFO);
            await service.completeOrder(sessionId, storeId, PAYMENT_INFO, SHIPPING_INFO);
        }
    }

    private basketToString = (b: basketState)=>{
        var s = `${b.store} basket: [`;
        b.items.forEach(item =>{
            s += `${item.name}-${item.quantity}, `;
        })
        s += ']';
        return s;
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

    private convertDiscount = (storeName: string, discount: discountState) =>{
        if(discount.type==="unconditional"){
            var fixedOp = this.convertOperand(storeName, discount.category);
            if((typeof fixedOp === 'string') && (!isNaN(parseInt(fixedOp)))) fixedOp = Number(fixedOp);
            discount.category = fixedOp;
        }
        else if(discount.type==="conditional"){
            var fixedOp = this.convertOperand(storeName, discount.category);
            if((typeof fixedOp === 'string') && (!isNaN(parseInt(fixedOp)))) fixedOp = Number(fixedOp);
            discount.category = fixedOp;

            this.convertPredicate(storeName, discount.predicate);
        }
        else if(discount.type==="combo"){
            discount.discounts.forEach(d => this.convertDiscount(storeName, d));
        }

    }

    private convertOperand = (storeName: string, op: string|number):string|number =>{
        if(typeof op === 'number') return op;
        
        const parts:string[] = op.split("_");
        for(var i=0; i<parts.length; i++){
            if(parts[i].startsWith(PRODUCT_PREF,0)){
                const pair = parts[i].split(":");
                const productName = pair[1];
                const productId = this.products.get(storeName).get(productName);
                parts[i] = `${productId}`;
            }
        }
        return parts.join("_");
    }

    private convertPredicate = (storeName: string, pred: predState) =>{        
        if(pred.type === "simple"){
            pred.operand1 = this.convertOperand(storeName, pred.operand1);
            pred.operand2 = this.convertOperand(storeName, pred.operand2);            
        }else{
            pred.operands.forEach((operand:any) => {
                operand =  this.convertPredicate(storeName, operand);
            });
        }
    }

    private logoutUsers = async(service: Service) => {
        for(var subIdx=0; subIdx<state.subscribers.length; subIdx++){
            const subState = state.subscribers[subIdx];
            if(!subState.logged_in){
                const sessionId = this.sessions.get(subState.name);
                await service.logout(sessionId);
            }
        }
    }

    private initCategory = async (service: Service,founderId:string, storeId: number, cat:any, father:string) => {
        if(father == ROOT_CATEGORY) await service.addCategoryToRoot(founderId, storeId, cat.name);
        else await service.addCategory(founderId, storeId, father, cat.name );
        
        for(var i=0; i<cat.categories.length; i++){
            const subCat = cat.categories[i];
            await this.initCategory(service, founderId, storeId, subCat, cat.name)
        }
    }

    private getQuantityInHistory = (storeName: string, itemName: string):number =>{
        var acc: number = 0;
        for(var tIdx=0; tIdx<state.history.length; tIdx++){
            if(state.history[tIdx].store === storeName){
                var quantity: number = 0;
                try{
                    quantity = state.history[tIdx].basket
                                .find((itemState,i,arr) => itemState.name===itemName).quantity;
                }catch{
                    quantity = 0;
                }
                acc += quantity;
            }
        }
        return acc;
    }
    private getQuantityInCarts = (storeName: string, itemName: string):number =>{
        var acc: number = 0;
        for(var subIdx=0; subIdx<state.subscribers.length; subIdx++){
            var quantity: number = 0;
            try{
                quantity = state.subscribers[subIdx].cart
                        .find((basketState,i,arr) => basketState.store===storeName).items
                        .find((itemState,i,arr) => itemState.name===itemName).quantity;
            }catch{
                quantity = 0;
            }
            acc += quantity;
        }
        return acc;
    }
}