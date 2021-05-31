import { Store } from "../../DomainLayer/store/Store";
import { sequelize } from "../connectDb";
import { iStoreDB } from "../interfaces/iStoreDB";


class StoreDB implements iStoreDB
{
    public async addStore(store: Store): Promise<void>
    {
        await sequelize.models.Store.create({
            id: store.getStoreId(),
            storeName: store.getStoreName(),
            storeRating: store.getStoreRating(),
            numOfRaters: 0, //TODO: change
            bankAccount: store.getBankAccount(),
            storeAddress: store.getStoreAddress(),
            storeClosed: store.getIsStoreClosed()
        })
    }

    public async getStoreByID(storeId: number): Promise<Store>
    {
        let store = await sequelize.models.Store.findOne(
            {
                where:
                {
                    id: storeId
                }
            }
        )

        if(store !== null)
        {
            return Promise.resolve(store);
        }
        return Promise.reject("store not found!");
    }
    deleteStore: (storeId: number) => Promise<void>;
    getStoreByName: (storeName: string) => Promise<Store>;
    getPruductInfoByName: (productName: string) => Promise<string>;
    getPruductInfoByCategory: (category: string) => Promise<string>;
    getProductInfoAbovePrice: (price: number) => Promise<string>;
    getProductInfoBelowPrice: (price: number) => Promise<string>;
    getPruductInfoByStore: (storeName: string) => Promise<string>;
    clear: () => void;
    
}