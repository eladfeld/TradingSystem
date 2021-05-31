import { strictEqual } from "assert";
import DiscountPolicy from "../../DomainLayer/discount/DiscountPolicy";
import BuyingPolicy from "../../DomainLayer/policy/buying/BuyingPolicy";
import { TreeRoot } from "../../DomainLayer/store/Common";
import { Store } from "../../DomainLayer/store/Store";
import { Appointment } from "../../DomainLayer/user/Appointment";
import { ManagerAppointment } from "../../DomainLayer/user/ManagerAppointment";
import { OwnerAppointment } from "../../DomainLayer/user/OwnerAppointment";
import { Permission } from "../../DomainLayer/user/Permission";
import { Logger } from "../../Logger";
import { Op, sequelize } from "../connectDb";
import { iStoreDB } from "../interfaces/iStoreDB";
import { SubscriberDB } from "./SubscriberDB";


export class StoreDB implements iStoreDB
{
    public async addStore(store: Store): Promise<number>
    {

        let stores = await sequelize.models.Store.findAll({
            where:{
                storeName: store.getStoreName()
            }
        });
        if(stores.length !== 0){
            Logger.log("store name alreay exists");
            return Promise.reject("store name alreay exists")
        }

        let storeT = await sequelize.models.Store.create({
            id: store.getStoreId(),
            storeName: store.getStoreName(),
            storeRating: store.getStoreRating(),
            numOfRaters: 0, //TODO: change
            bankAccount: store.getBankAccount(),
            storeAddress: store.getStoreAddress(),
            storeClosed: store.getIsStoreClosed()
        })

        return storeT.id;
    }

    public async getStoreByID(storeId: number): Promise<Store>
    {
        let store = await sequelize.models.Store.findByPk(storeId)
        if(store === undefined)
            return Promise.reject("invalid store id");

        
        
        return this.buildStore(store)
        
    }
    
    private async buildStore(store: any) : Promise<Store>
    {
        //TODO: get real categories
        let categories = new TreeRoot<string>('root category');

        return Store.rebuildStore(
            store.id,
            store.SubscriberId,
            store.storeName,
            store.bankAccount,
            store.storeAddress,
            await this.getAppointmentByStoreId(store.id),
            store.storeClosed,
            new BuyingPolicy(), //TODO: get old buying policy
            new DiscountPolicy(), //TODO: get old discount policy
            categories

        )
    }

    private async getAppointmentByStoreId(storeId : number) : Promise<Appointment[]>
    {
        let appointments = await sequelize.models.Appointment.findAll({
            where:{
                StoreId: storeId
            }
        })
        Logger.log(`getting appointments response ${JSON.stringify(appointments)}`)
        let apps: Appointment[] = appointments.map(
            (app : any) => app.isManager ?
            new ManagerAppointment(app.appointerId, app.StoreId, app.appointeeId, new Permission(app.permissionsMask)) :
            new OwnerAppointment(app.appointerId, app.StoreId, app.appointeeId, new Permission(app.permissionsMask)))

        return apps;
    }
    
    public async deleteStore(storeId: number): Promise<void>
    {
        await sequelize.models.Store.destroy(
            {
                where:
                {
                    id: storeId
                }
            }
        )
    }
    
    public async getStoreByName(storeName: string): Promise<Store>
    {

        let store = await sequelize.models.Store.findOne({
            where: {
                storeName: storeName
            }
        })
        
        if(store === undefined)
            return Promise.reject(`${storeName} doesnt exist`);

        
        
        return this.buildStore(store)
    }

    public async searchStoreProductsByName(productName: string)
    {
        let storeProducts = await sequelize.models.Store.findAll({
            where: {
                name: productName
            }
        })
        return storeProducts
    }
    
    public async getStoreNameById(storeId : number) : Promise<string>
    {
        let store = await sequelize.models.Store.findByPk(storeId)
        if (store === null)
            return Promise.reject(`store ${storeId} not found`)
        
        return Promise.resolve(store.storeName);
    }

    public async getPruductInfoByName(productName: string): Promise<string>
    {
        let storeProducts : [{}] = await this.searchStoreProductsByName(productName);
        var products : any = {}
        products['products']=[]
        let products_infop = storeProducts.map(async (storeProduct: any) => {
                products['products'].push({ 'productName':storeProduct.name,
                                            'numberOfRaters':storeProduct.numOfRaters,
                                            'rating':storeProduct.productRating,
                                            'price': storeProduct.price,
                                            'storeName': await this.getStoreNameById(storeProduct.StoreId),
                                            'StoreId': storeProduct.StoreId,
                                            'productId': storeProduct.id,
                                        })

        })
        return Promise.all(products_infop).then( _ => {
                let jsonProducts = JSON.stringify(products)
                Logger.log(`Getting products by name answer: ${JSON.stringify(jsonProducts)}`)
                return jsonProducts
        }).catch( error => Promise.reject(error))

    }

    public async getPruductInfoByCategory(category: string): Promise<string>
    {
        return Promise.resolve("TODO:")
    }

    public async getProductInfoAbovePrice(price: number): Promise<string>
    {
        let storeProducts = await sequelize.models.StoreProduct.findAll({
            where: {
                price: {
                    [Op.gt]: price,
                }
            }
        });
        return storeProducts
    }

    public async getProductInfoBelowPrice(price: number): Promise<string>
    {
        let storeProducts = await sequelize.models.StoreProduct.findAll({
            where: {
                price: {
                    [Op.lt]: price,
                }
            }
        });
        return storeProducts
    }

    public async getPruductInfoByStore(storeName: string): Promise<string>
    {
return Promise.resolve("TODO:")
    }

    clear: () => void;
    
}