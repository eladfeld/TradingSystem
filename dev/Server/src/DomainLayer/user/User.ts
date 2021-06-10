import { StoreDB, SubscriberDB } from '../../DataAccessLayer/DBinit';
import iSubject from '../discount/logic/iSubject';
import { tShippingInfo } from '../purchase/Purchase';
import { buyingOption } from '../store/BuyingOption';
import { ShoppingBasket } from './ShoppingBasket';
import { ShoppingCart} from './ShoppingCart'
import { Subscriber } from './Subscriber';

export type PaymentMeans = undefined;
export type SupplyInfo = undefined;


export class User implements iSubject
{
    protected shoppingCart: ShoppingCart;
    protected userId: number;
    protected static lastId: number =0 ;

    public constructor()
    {
        this.shoppingCart = new ShoppingCart();
        this.userId = User.lastId++;
    }

    static initLastId(): Promise<number> 
    {
        let lastIdPromise = SubscriberDB.getLastId();

        return new Promise((resolve, reject) => {
            lastIdPromise
            .then(id => {
                if(isNaN(id)) id = 0;
                User.lastId = id;
                resolve(id);
            })
            .catch(e => reject("problem with user id "))
        })
    }


    public static UserinitLastId()
    {
        SubscriberDB.getLastId().then(id => User.lastId = id);
    }

    public checkoutBasket(storeId: number, shippingInfo: tShippingInfo): Promise<boolean>
    {
        let checkoutp = this.shoppingCart.checkoutBasket(this.getUserId(), this, storeId, shippingInfo, this);
        return new Promise((resolve,reject) => {
            checkoutp.then( isSusccesfull => {
                this.shoppingCart.getBaskets().delete(storeId);
                resolve(isSusccesfull)
            })
            .catch( error => reject(error))
        })
    }

    public deleteShoppingBasket(storeId : number) : Promise<void>
    {
        // this is user so no need to delete from DB
        this.shoppingCart.deleteShoppingBasket(storeId)
        return Promise.resolve()
    }

    public checkoutSingleProduct(productId :number , quantity: number, shippingInfo: tShippingInfo, shopId : number , buying_option : buyingOption) : Promise<string>
    {
        let storep =  StoreDB.getStoreByID(shopId);
        return new Promise ((resolve,reject) => {
            storep.then (store => {
                let sellp = store.sellProduct(this.getUserId() , shippingInfo,productId, quantity, buying_option);
                sellp.then( msg => resolve(msg))
                .catch( error => reject(error))
            })
            .catch( error => reject(error))
        })
    }       
    
    public addProductToShoppingCart(storeId: number,  productId: number, quntity: number) : Promise<ShoppingBasket>
    {
        return this.shoppingCart.addProduct(storeId, productId, quntity);
    }

    public GetShoppingCart(): Promise<string>
    {
        return this.shoppingCart.getShoppingCart();
    }

    public getShoppingBasket(storeId: number): {}
    {
        return this.shoppingCart.getBasketById(storeId);
    }

    public getUserId(): number
    {
        return this.userId;
    }

    public editCart(storeId: number, productId: number, quantity: number): Promise<string>
    {
        return this.shoppingCart.editStoreCart(storeId, productId, quantity);
    }

    getValue =  (field: string): number => {
        if(this instanceof Subscriber){
            return this.getAge();
        }
        else {
            return -1;
        }
    }

    //---------------functions for tests-------------------
    public quantityInBasket(storeId : number , productId : number) : number
    {
        let quantity = this.shoppingCart.quantityInBasket(storeId,productId)
        if (quantity === undefined)
            return 0;
        return quantity;
    }

}


