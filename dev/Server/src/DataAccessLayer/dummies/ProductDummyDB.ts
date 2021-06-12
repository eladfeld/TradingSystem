import { StoreProduct } from "../../DomainLayer/store/StoreProduct";
import { iProductDB } from "../interfaces/iProductDB";


export class ProductDummyDB implements iProductDB
{
    updateProduct: (product: StoreProduct) => Promise<void>;

    public async getLastProductId(): Promise<number>
    {
        return Promise.resolve(1);
    }

    getAllProductsOfStore: (storeId: number) => Promise<StoreProduct[]>;


    private  products: StoreProduct[]  = [];

    public  addProduct(product: StoreProduct): Promise<void>
    {
        this.products.push(product);
        return Promise.resolve()
    }

    public  async getProductByName(productName: string): Promise<StoreProduct>
    {
        let product = this.products.find(product => product.getName() == productName);
        if (product)
            return Promise.resolve(product)
        return Promise.reject("product not found1")
    }

    public  async getProductById(productId: number): Promise<StoreProduct>
    {
        let product = this.products.find(product => product.getProductId() === productId);
        if (product)
            return Promise.resolve(product)
        return Promise.reject("product not found2")
    }

    public  clear()
    {
        this.products=[]
    }

}