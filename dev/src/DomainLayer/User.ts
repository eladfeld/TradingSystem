import { ShoppingCart} from './ShoppingCart'


export class User
{
    private shoppingCart: ShoppingCart;


    public constructor()
    {
        this.shoppingCart = new ShoppingCart();
    }

    public addProductToShoppingCart(storeId: number,  productId: number, quntity: number)
    {
        this.shoppingCart.addProduct(storeId, productId, quntity);
    }


}