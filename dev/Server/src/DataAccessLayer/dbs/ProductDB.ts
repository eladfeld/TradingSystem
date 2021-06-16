import { StoreProduct } from "../../DomainLayer/store/StoreProduct";
import { Logger } from "../../Logger";
import { categories } from "../../ServiceLayer/state/InitialStateConstants";
import { sequelize } from "../connectDb";
import { DB } from "../DBfacade";
import { iProductDB } from "../interfaces/iProductDB";


export class productDB implements iProductDB
{
    public async getLastProductId(): Promise<number>
    {
        try{
            let lastId = await sequelize.models.StoreProduct.max('id')
            if (lastId === null)
                return 0;
            return lastId + 1
        }
        catch(e)
        {
            return Promise.reject("database error, please try again later")
        }

    }


    public async addProduct(product: StoreProduct): Promise<void>
    {
        try{
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
                await DB.addCategoriesOfProduct(product.getProductId(), category, product.getStoreId())
            }
        }
        catch(e)
        {
            Logger.error("database error, please try again later")
            return Promise.reject("database error, please try again later")
        }

    }

    public async updateProduct(product: StoreProduct): Promise<void>{
        try{
            await sequelize.models.StoreProduct.update(
                {
                    price: product.getPrice(),
                    quantity: product.getQuantity(),
                    productRating: product.getProductRating(),
                    numOfRaters: product.getNumOfRaters(),
                    image: product.getImage(),
                },
                {
                    where:
                    {
                        id: product.getProductId(),
                    }
                } )
            return Promise.resolve()
        }
        catch(e)
        {
            Logger.error("database error, please try again later")
            return Promise.reject("database error, please try again later")
        }
        
    }

    public async getProductById(productId: number):Promise<StoreProduct>
    {
        try{
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
                    await DB.getCategoriesOfProduct(productdb.id),
                    productdb.image,
    
                );
                return Promise.resolve(product);
            }
            return Promise.resolve(undefined);
        }
        catch(e)
        {
            Logger.error("database error, please try again later")
            return Promise.reject("database error, please try again later")
        }
    }

    public async getAllProductsOfStore(storeId: number):Promise<StoreProduct[]>
    {
        try{
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
                    await DB.getCategoriesOfProduct(productdb.id),
                    productdb.image,
    
                ));
            }
            return Promise.resolve(products);
        }
        catch(e)
        {
            Logger.error("database error, please try again later")
            return Promise.reject("database error, please try again later")
        }
    }

    clear: () => void;
    public willFail= () =>{
        throw new Error("can not force failure outside of test mode")
    }
    public willSucceed= () =>{
        throw new Error("can not force success outside of test mode")
    }
}