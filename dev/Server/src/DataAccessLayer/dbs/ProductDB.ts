import { StoreProduct } from "../../DomainLayer/store/StoreProduct";
import { categories } from "../../ServiceLayer/state/InitialStateConstants";
import { sequelize } from "../connectDb";
import { StoreDB } from "../DBinit";
import { iProductDB } from "../interfaces/iProductDB";


export class productDB implements iProductDB
{
    public async getLastProductId(): Promise<number>
    {
        let lastId = await sequelize.models.StoreProduct.max('id')
        if (lastId === null)
            return 0;
        return lastId + 1
    }


    public async addProduct(product: StoreProduct): Promise<void>
    {
 
        let prod = await sequelize.models.StoreProduct.create({
            id: product.getProductId(),
            name: product.getName(),
            price: product.getPrice(),
            quantity: product.getQuantity(),
            productRating: product.getProductRating(),
            numOfRaters: product.getNumOfRaters(),
            image: product.getImage(),
            StoreId: product.getStoreId(),
        })

        // checking that store has categories in Store.addNewProduct
        for(let category of product.getCategories()){
            await StoreDB.addCategoriesOfProduct(product.getProductId(), category, product.getStoreId())
        }
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
                await StoreDB.getCategoriesOfProduct(productdb.id),
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
                await StoreDB.getCategoriesOfProduct(productdb.id),
                productdb.image,

            ));
        }
        return Promise.resolve(products);
    }

    clear: () => void;

}