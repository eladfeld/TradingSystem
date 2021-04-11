import { Store } from "../store/Store";

export class ShoppingBasket
{
    
    private store : Store ;
    private products: Map<number,number>;    //key: productId, value: quantity

    public constructor(storeid:number)
    {
        this.products = new Map();
        //TODO: access store database and get the store that have this id
    
    }

    getStoreId(): number
    {
        return this.store.getStoreId();
    }

    getProducts(): Map<number,number>
    {
        return this.products;
    }

    addProduct(productId: number, quantity: number): number 
    {
        if (quantity < 0)
            return -1;
        if(!this.store.isProductAvailable(productId, quantity))
            return -1;
        let prevQuantity : number = 0;
        if (this.products.get(productId) != undefined)
            prevQuantity = this.products.get(productId);
        this.products.set(productId, prevQuantity+quantity);
        return 0;
    }

    edit(productId: number, newQuantity: number): number 
    {
        if (newQuantity < 0)
            return -1;
        if (!this.store.isProductAvailable(productId,newQuantity))
            return -1;

        this.products.set(productId,newQuantity)
        if (newQuantity === 0)
            this.products.delete(productId);
        return 0;
    }

    //------------------------------------functions for tests-------------------------------------
    
    public clear() : void
    {
        this.products = new Map();
    }
    public setStore(store:Store) : void
    {
        this.store = store;
    }
}