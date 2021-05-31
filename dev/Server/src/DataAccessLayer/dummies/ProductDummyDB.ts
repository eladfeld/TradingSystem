import { StoreProduct } from "../../DomainLayer/store/StoreProduct";
import { iProductDB } from "../interfaces/iProductDB";


export class ProductDummyDB implements iProductDB
{
    getProductQuantity: (productId: number) => Promise<number>;
    getProductByStoreId(storeId: number, productName: string): Promise<StoreProduct> {
        throw new Error("Method not implemented.");
    }
    getAllProductByStoreId: (storeId: number) => Promise<StoreProduct[]>;


    private  products: StoreProduct[]  = [];

    public updateProduct: (product: StoreProduct) => void;

    public  addProduct(product: StoreProduct): Promise<number>
    {
        this.products.push(product);
        return Promise.resolve(0);
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