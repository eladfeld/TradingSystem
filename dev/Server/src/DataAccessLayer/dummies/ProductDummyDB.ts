import { Product } from "../../DomainLayer/store/Product";
import { iProductDB } from "../interfaces/iProductDB";


export class ProductDummyDB implements iProductDB
{


    private  products: Product[]  = [];

    public  addProduct(product: Product): void
    {
        this.products.push(product);
    }

    public  addWitheredProduct(wproduct: Product): void
    {
        this.products.push(wproduct);
    }

    public  async getProductByName(productName: string): Promise<Product>
    {
        let product = this.products.find(product => product.getName() == productName);
        if (product)
            return Promise.resolve(product)
        return Promise.reject("product not found1")
    }

    public  async getProductById(productId: number): Promise<Product>
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