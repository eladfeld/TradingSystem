import { StoreProduct } from "../../DomainLayer/store/StoreProduct";
import { sequelize } from "../connectDb";
import { iProductDB } from "../interfaces/iProductDB";


export class productDB implements iProductDB
{
    public async addProduct(product: StoreProduct): Promise<void>
    {
        let prod = await sequelize.models.StoreProduct.create({
            name: product.getName(),
            price: product.getPrice(),
            quantity: product.getQuantity(),
            productRating: product.getProductRating(),
            numOfRaters: product.getNumOfRaters(),
            image: product.getImage(),
            StoreId: product.getStoreId(),
        }) 
    }
    
    public async getProductById(productId: number):Promise<StoreProduct>
    {
        let productdb = await sequelize.models.StoreProduct.findOne(
            {
                where:
                {
                    id: productId
                }
            }
        )

        if(productdb !== null && productdb != [] && productdb !== undefined)
        {
            let product = StoreProduct.rebuildProduct(
                productdb.id,
                productdb.name,
                productdb.price,
                productdb.StoreId,
                productdb.quantity,
                await this.getCategoriesByProductId(productId),
                productdb.image,

            );
            return Promise.resolve(product);
        }
        return Promise.resolve(undefined);
    }

    public async getAllProductsOfStore(storeId: number):Promise<StoreProduct[]>
    {
        let productsdb = await sequelize.models.StoreProduct.findAll(
            {
                where:
                {
                    storeId: storeId
                }
            }
        )

        let products = []
        for(let productdb of productsdb)
        {
            products.push(StoreProduct.rebuildProduct(
                productdb.id,
                productdb.name,
                productdb.price,
                productdb.StoreId,
                productdb.quantity,
                await this.getCategoriesByProductId(productdb.id),
                productdb.image,

            ));
        }
        return Promise.resolve(products);
    }

    public async getCategoriesByProductId(pid: number): Promise<string[]> {
        // return (await sequelize.models.Category.findAll({
        //     where: {
        //         StoreProductId: pid,
        //     }
        // })).map((categories: any) => categories.name);
        return [];
    }

    clear: () => void;
    
}