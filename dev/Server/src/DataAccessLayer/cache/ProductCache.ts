import { StoreProduct } from "../../DomainLayer/store/StoreProduct";
import { productDB } from "../dbs/ProductDB";
import { purchaseDB } from "../dbs/PurchaseDB";
import { iProductDB } from "../interfaces/iProductDB";


export class ProductCache implements iProductDB
{

    private products: Map<number, [boolean, StoreProduct]>
    private productDb: iProductDB;
    public constructor()
    {
        this.products = new Map();
        this.productDb = new productDB;
    }

    public getLastProductId (): Promise<number>
    {
        return this.productDb.getLastProductId();
    }
    public addProduct(product: StoreProduct): Promise<void>
    {
        return this.productDb.addProduct(product);
    }
    public getAllProductsOfStore(storeId: number):Promise<StoreProduct[]>
    {
        return this.productDb.getAllProductsOfStore(storeId);
    }
    public getProductById(productId: number): Promise<StoreProduct>
    {
        return this.productDb.getProductById(productId);
    }
    public clear ():void
    {
        this.productDb.clear()
    }
    
}