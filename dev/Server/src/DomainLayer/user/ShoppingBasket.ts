import { isOk, makeFailure, makeOk, Result } from "../../Result";
import { Logger } from "../../Logger";
import { buyingOption } from "../store/BuyingOption";
import { Product } from "../store/Product";
import { ProductDB } from "../store/ProductDB";
import { Store } from "../store/Store";
import { PaymentMeans, SupplyInfo } from "./User";
import iSubject from "../discount/logic/iSubject";
import iBasket from "../discount/iBasket";
import { iProduct, MyProduct } from "../discount/iProduct";
import BuyingSubject from "../policy/buying/BuyingSubject";

export class ShoppingBasket implements iBasket
{

    private store : Store ;
    private products: Map<number,number>;    //key: productId, value: quantity

    public constructor(store:Store)
    {
        this.products = new Map();
        this.store = store;
    }

    public getItems = () : iProduct[] =>{
        const output: iProduct[] = [];
        const allProducts = this.store.getProductsInfo();
        for(const [productId, quantity] of this.products){
            const prod = allProducts.find(p => p.getProductId() === productId);
            const myProduct = new MyProduct(productId,prod.getPrice(), quantity, prod.getName(),prod.getCategories());
            output.push(myProduct);       
        }
        return output
    }

    getStoreId(): number
    {
        return this.store.getStoreId();
    }

    public getProducts(): Map<number,number>
    {
        return this.products;
    }

    public addProduct(productId: number, quantity: number): Promise<string>
    {
        if (quantity < 0){
            Logger.log("quantity can't be negative number");
            return new Promise( (resolve,reject) => reject("quantity can't be negative number"));
        }
        if(quantity === 0){
            return new Promise( (resolve,reject) => reject("quantity can't be set to zero"));
        }
        if (!this.store.hasBuyingOption(buyingOption.INSTANT)){
            Logger.log("product not for immediate buy");
            return new Promise( (resolve,reject) => reject("product not for immediate buy"));
        }
        if(!this.store.isProductAvailable(productId, quantity)){
            return new Promise( (resolve,reject) => reject("product is not available in this quantity"));
        }

        let prevQuantity : number = 0;
        if (this.products.get(productId) != undefined)
            prevQuantity = this.products.get(productId);
        this.products.set(productId,prevQuantity+quantity);
        return new Promise( (resolve,reject) => resolve("product added to cart"));
    }

    public checkout(userId:number, user: iSubject,  supply_address: string, userSubject: iSubject): Promise<boolean>
    {
        // this function restores the basket in case the purchase failed
        let products = this.getProducts()
        let onfail = () => {
            products.forEach( (quantity , productId , _ ) =>
                this.addProduct(productId,quantity)
            )
        }
        let buyingSubject = new BuyingSubject(userSubject, this);
        let sellp =  this.store.sellShoppingBasket(userId, supply_address, this, buyingSubject , onfail);
        return new Promise((resolve,reject) => {
            sellp.then( sell_res => { resolve(sell_res) })
            .catch( error => reject(error))
        })
    }

    public edit(productId: number, newQuantity: number): Promise<string>
    {
        if (newQuantity < 0)
            return Promise.reject("negative quantity");
        if (!this.store.isProductAvailable(productId,newQuantity))
            return Promise.reject("quantity not available");
        if (newQuantity === 0)
            this.products.delete(productId);
        else this.products.set(productId,newQuantity);
        return Promise.resolve("added to cart");
    }

    getShoppingBasket() : {}
    {
        var basket : any = {}
        basket['store'] = this.store.getStoreName();
        basket['storeId'] = this.store.getStoreId();
        basket['products']=[]
        this.products.forEach(function(quantity,productId,map){
            let product: Product = ProductDB.getProductById(productId);
            basket['products'].push({'productId':productId , 'name':product.getName(),'quantity':quantity})
        })
        return basket;
    }

    public getValue = (field: string):number => {
        const strs: string[] = field.split("_");
        if(strs.length === 2){
            const id: number = parseInt(strs[0]);
            if(!isNaN(id)){//product
                switch(strs[1]){
                    case "price":
                        return this.store.getProductsInfo().find(p => p.getProductId() === id).getPrice();
                    case "quantity":
                        const quantity = this.products.get(id);
                        return quantity? quantity : 0;
                    default:
                        return undefined;
                }
            }
            else{//category
                const prodsInCategory = this.store.getProducts(strs[0]);                
                switch(strs[1]){
                    case "quantity":
                        var acc = 0;
                        this.products.forEach( (q:number,id:number,m) => {
                            if(!isNaN(prodsInCategory.find((pid:number) => pid===id))) acc += q;
                        });
                        return acc;
                    default:
                        return undefined;
                }
            }
        }
        return undefined;
    };


    //------------------------------------functions for tests-------------------------------------

    public clear() : void
    {
        this.products = new Map();
    }
    public setStore(store:Store) : void
    {
        this.store = store;
    }

    quantity = (productId : number) : number =>
    {
        return this.products.get(productId);
    }
}