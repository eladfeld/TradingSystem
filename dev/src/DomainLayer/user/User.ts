import { ShoppingCart} from './ShoppingCart'


export class User
{
    public shoppingCart: ShoppingCart;


    public constructor()
    {
        this.shoppingCart = new ShoppingCart();
    }

    public addProductToShoppingCart(storeId: number,  productId: number, quntity: number)
    {
        this.shoppingCart.addProduct(storeId, productId, quntity);
    }

    public GetShoppingCart(): number[]
    {
        return this.shoppingCart.getShoppingCart();
    }

    public getShoppingBasket(storeId: number): Map<number, number>
    {
        return this.shoppingCart.getShoppingBasket(storeId);
    }

    
    public getUserId(): number
    {
        return -1;
    }


}