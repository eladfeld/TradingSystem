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

    public checkoutBasket(shopId: number, supply_address: string): Result<boolean>
    {
        return this.shoppingCart.checkoutBasket(this.getUserId() ,shopId, supply_address);
    }

    public checkoutSingleProduct(productId :number , quantity: number, supplyInfo: string, shopId : number , buying_option : buyingOption) : Result<string>
    {
        let store:Store =  StoreDB.getStoreByID(shopId);
        return store.sellProduct(this.getUserId() , supplyInfo,productId, quantity, buying_option);
    }
    public addProductToShoppingCart(storeId: number,  productId: number, quntity: number) : Result<string>
    {
        return this.shoppingCart.addProduct(storeId, productId, quntity);
    }

    public GetShoppingCart(): Result<string>
    {
        return makeOk(JSON.stringify(this.shoppingCart.getShoppingCart()));
    }

    public getShoppingBasket(storeId: number): {}
    {
        return this.shoppingCart.getBasketById(storeId);
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

