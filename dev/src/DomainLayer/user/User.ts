import { updateEnumMember, updateNamespaceExportDeclaration } from 'typescript';
import { makeFailure, makeOk, Result } from '../../Result';
import { buyingOption, BuyingOption } from '../store/BuyingOption';
import { ShoppingCart} from './ShoppingCart'

export type PaymentMeans = undefined; 
export type SupplyInfo = undefined; 


export class User
{
    private shoppingCart: ShoppingCart;
    private userId: number;
    private static lastId : number = User.getLastId();

    public constructor()
    {
        this.shoppingCart = new ShoppingCart();
        this.userId = User.lastId++;
    }

    private static getLastId() : number
    {
        return 0;
    }
    
    public buyBasket(shopId: number, paymentMeans: PaymentMeans, supplyInfo: SupplyInfo): Result<string>
    {
        return this.shoppingCart.buyBasket(shopId, paymentMeans, supplyInfo);
    }

    public buyProduct(productId :number , shopId : number , buying_option : buyingOption) : Result<string>
    {
        //TODO: but a single product 
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


}


//TODO: override buyBasket in subscriber and add to user history there!