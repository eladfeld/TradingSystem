import { StoreProduct } from "../../DomainLayer/store/StoreProduct";
import { sequelize } from "../connectDb";
import { iProductDB } from "../interfaces/iProductDB";


export class ProductDB implements iProductDB
{
    getProductQuantity: (productId: number) => Promise<number>;
    getProductByStoreId(storeId: number, productName: string): Promise<StoreProduct> {
        throw new Error("Method not implemented.");
    }
    
    updateProduct: (product: StoreProduct) => void;
    getAllProductByStoreId: (storeId: number) => Promise<StoreProduct[]>;
    public async addProduct(product: StoreProduct): Promise<number>
    {
        let prod = await sequelize.models.StoreProduct.create({
            name: product.getName(),
            price: product.getPrice(),
            quantity: product.getQuantity(),
            productRating: product.getProductRating(),
            numOfRaters: product.getNumOfRaters()
        }) 
        return prod.id;
    }
    getProductByName: (productName: string) => Promise<StoreProduct>;
    getProductById: (productId: number) => Promise<StoreProduct>;
    clear: () => void;
    
}