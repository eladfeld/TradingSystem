import { StoreProduct } from "../../DomainLayer/store/StoreProduct";
import { iProductDB } from "../interfaces/iProductDB";


export class ProductDummyDB implements iProductDB
{
    private isConnected = true;
    public async getLastProductId(): Promise<number>
    {
        return Promise.resolve(1);
    }
    
    getAllProductsOfStore: (storeId: number) => Promise<StoreProduct[]>;

    
    private  products: StoreProduct[]  = [];

    public  addProduct(product: StoreProduct): Promise<void>
    {
        if(!this.isConnected)return Promise.reject("database is disconnected");
        this.products.push(product);
        return Promise.resolve()
    }

    public  async getProductByName(productName: string): Promise<StoreProduct>
    {
        if(!this.isConnected)return Promise.reject("database is disconnected");
        let product = this.products.find(product => product.getName() == productName);
        if (product)
            return Promise.resolve(product)
        return Promise.reject("product not found1")
    }

    public  async getProductById(productId: number): Promise<StoreProduct>
    {
        if(!this.isConnected)return Promise.reject("database is disconnected");
        let product = this.products.find(product => product.getProductId() === productId);
        if (product)
            return Promise.resolve(product)
        return Promise.reject("product not found2")
    }

    public  clear()
    {
        this.products=[]
    }

    public willFail = () =>{
        this.isConnected = false;
    }

    public willSucceed = () =>{
        this.isConnected = true;
    }

}