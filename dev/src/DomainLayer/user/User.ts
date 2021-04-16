import { isOk, makeFailure, makeOk, Result } from '../../Result';
import { buyingOption, BuyingOption } from '../store/BuyingOption';
import { Store } from '../store/Store';
import { StoreDB } from '../store/StoreDB';
import { ShoppingCart} from './ShoppingCart'

export type PaymentMeans = undefined; 
export type SupplyInfo = undefined; 


export class User
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

    
    public buyCart(paymentMeans : PaymentMeans , supplyInfo : SupplyInfo) :Result<string>
    {
        return this.shoppingCart.buyCart(paymentMeans, supplyInfo);
    }
    
    public buyBasket(shopId: number, paymentMeans: PaymentMeans, supplyInfo: SupplyInfo): Result<string>
    {
        return this.shoppingCart.buyBasket(shopId, paymentMeans, supplyInfo);
    }

    public buyProduct(productId :number , quantity: number, paymentMeans: PaymentMeans, supplyInfo: SupplyInfo, shopId : number , buying_option : buyingOption) : Result<string>
    {
        //TODO: but a single product 
        let store:Store =  StoreDB.getStoreByID(shopId);
        //return store.buyProduct(productId, quantity, paymentMeans, supplyInfo);
        return makeFailure("not yet implemented");
    }   
    public addProductToShoppingCart(storeId: number,  productId: number, quntity: number) : Result<string>
    {
        return this.shoppingCart.addProduct(storeId, productId, quntity);
    }

    public GetShoppingCart(): Result<string>
    {
        return makeOk(JSON.stringify(this.shoppingCart));
    }

    public getShoppingBasket(storeId: number): {}
    {
        return this.shoppingCart.getShoppingBasket(storeId);
    }

    public getUserId(): number
    {
        return this.userId;
    }

    public editCart(storeId: number, productId: number, quantity: number): Result<string>
    {
        return this.shoppingCart.editStoreCart(storeId, productId, quantity);
    }


}


//TODO: override buyBasket in subscriber and add to user history there!