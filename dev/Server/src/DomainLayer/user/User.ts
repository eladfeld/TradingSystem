import { rejects } from 'assert';
import { StoreDB } from '../../DataAccessLayer/DBinit';
import { isOk, makeFailure, makeOk, Result } from '../../Result';
import iSubject from '../discount/logic/iSubject';
import { tShippingInfo } from '../purchase/Purchase';
import { buyingOption } from '../store/BuyingOption';
import { Store } from '../store/Store';
import { ShoppingBasket } from './ShoppingBasket';
import { ShoppingCart} from './ShoppingCart'
import { Subscriber } from './Subscriber';

export type PaymentMeans = undefined;
export type SupplyInfo = undefined;


export class User implements iSubject
{
    protected shoppingCart: ShoppingCart;
    protected userId: number;
    protected static lastId : number = User.getLastId();

    public constructor()
    {
        this.shoppingCart = new ShoppingCart();
        this.userId = User.lastId++;
    }

    private static getLastId() : number
    {
        return 0;
    }

<<<<<<< HEAD
    public checkoutBasket(shopId: number, shippingInfo: tShippingInfo): Result<boolean>
=======
    public checkoutBasket(shopId: number, supply_address: string): Promise<boolean>
>>>>>>> dd993e6468e277ff8968b6626d7b99ea3bd07b03
    {
        return this.shoppingCart.checkoutBasket(this.getUserId(), this, shopId, shippingInfo, this);
    }

<<<<<<< HEAD
    public checkoutSingleProduct(productId :number , quantity: number, shippingInfo: tShippingInfo, shopId : number , buying_option : buyingOption) : Result<string>
    {
        let store:Store =  StoreDB.getStoreByID(shopId);
        return store.sellProduct(this.getUserId() , shippingInfo,productId, quantity, buying_option);
    }
    public addProductToShoppingCart(storeId: number,  productId: number, quntity: number) : Result<string>
=======
    public checkoutSingleProduct(productId :number , quantity: number, supply_address: string, shopId : number , buying_option : buyingOption) : Promise<string>
    {
        let storep =  StoreDB.getStoreByID(shopId);
        return new Promise ((resolve,reject) => {
            storep.then (store => {
                let sellp = store.sellProduct(this.getUserId() , supply_address,productId, quantity, buying_option);
                sellp.then( msg => resolve(msg))
                .catch( error => reject(error))
            })
            .catch( error => reject(error))
        })
    }       
    
    public addProductToShoppingCart(storeId: number,  productId: number, quntity: number) : Promise<ShoppingBasket>
>>>>>>> dd993e6468e277ff8968b6626d7b99ea3bd07b03
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

