import DiscountPolicy from "../../DomainLayer/discount/DiscountPolicy";
import iDiscount from "../../DomainLayer/discount/iDiscount";
import BuyingPolicy, { Rule } from "../../DomainLayer/policy/buying/BuyingPolicy";
import { TreeRoot } from "../../DomainLayer/store/Common";
import { Store } from "../../DomainLayer/store/Store";
import { Appointment } from "../../DomainLayer/user/Appointment";
import { ManagerAppointment } from "../../DomainLayer/user/ManagerAppointment";
import { OwnerAppointment } from "../../DomainLayer/user/OwnerAppointment";
import { Permission } from "../../DomainLayer/user/Permission";
import { Logger } from "../../Logger";
import { sequelize, set_sequelize } from "../connectDb";
import { DB } from "../DBfacade";
import { iStoreDB } from "../interfaces/iStoreDB";
const Storedb = require('../models/Store')

export class storeDB implements iStoreDB
{
    sequelize_backup: any = sequelize;
    StoreUpdateCache(storeId: number): void {
        //empty on purpose
    }

    //add functions:
    public async addStore(store: Store): Promise<void>
    {
        try{
            await sequelize.models.Store.create({
                id: store.getStoreId(),
                storeName: store.getStoreName(),
                storeRating: store.getStoreRating(),
                numOfRaters: 0,
                bankAccount: store.getBankAccount(),
                storeAddress: store.getStoreAddress(),
                storeClosed: store.getIsStoreClosed(),
                founderId: store.getStoreFounderId(),
                recieveOffers: store.isRecievingOffers(),
            })
            return Promise.resolve();
        }
        catch(e)
        {
            Logger.error(e)
            return Promise.reject("data base error")
        }
    }

    public async addCategory(StoreId: number, category: string, father: string) : Promise<void>
    {
        try{
            await sequelize.models.Category.create({
                StoreId: StoreId,
                name: category,
                father: father,
            })
            return Promise.resolve();
        }
        catch(e)
        {
            return Promise.reject("category with the same id is alread exists!");
        }

    }

    public async addPolicy(storeId: number, rule: Rule): Promise<void>
    {
        try{
            await sequelize.models.BuyingPolicy.create({
                id: rule.id,
                name: rule.description,
                predicate: rule.predicate.toObject(),
                StoreId: storeId
            },
            {
                where:
                {
                    id: rule.id
                }
            })
            return Promise.resolve();
        }
        catch(e)
        {
            //"policy with the same id already exists!"
            return Promise.reject( e)
        }
    }

    public async addDiscountPolicy(id: number, discount: iDiscount, storeId: number): Promise<void>
    {
        try{
            await sequelize.models.DiscountPolicy.create({
                id: id,
                discount: discount.toObj(),
                StoreId: storeId
            })
            return Promise.resolve()
        }
        catch(e)
        {
            Logger.error(e)
            return Promise.reject("data base error")
        }

    }


    public async addCategoriesOfProduct(productId: number, category: string, storeId: number) : Promise<void>
    {
        try{
            await sequelize.models.ProductToCategory.create({
                StoreProductId: productId,
                category: category,
                StoreId: storeId,
            })
            return Promise.resolve()
        }
        catch(e)
        {
            return Promise.reject("category with the id alreay exists!")
        }
    }



    //get functions:

    public async getLastStoreId() : Promise<number>
    {
        let lastId = await sequelize.models.Store.max('id')
        if (lastId === null)
            return 0;
        return lastId + 1
    }


    public async getLastDiscountId() : Promise<number>
    {
        let lastId = await sequelize.models.DiscountPolicy.max('id')
        if (lastId === null)
            return 0;
        return lastId + 1
    }


    public async getLastBuyingId() : Promise<number>
    {
        let lastId = await sequelize.models.BuyingPolicy.max('id')
        if (lastId === null)
            return 0;
        return lastId + 1
    }


    public async getStoreByID(storeId: number): Promise<Store>
    {
        try{
            
        let storedb = await sequelize.models.Store.findOne(
            {
                where:
                {
                    id: storeId
                }
            }
        )
        if(storedb !== null && storedb != [] && storedb !== undefined)
        {
            let store = Store.rebuild(storedb,
                await this.getAppointmentByStoreId(storedb.id),
                await DB.getAllProductsOfStore(storedb.id),
                await this.getAllCategories(storedb.id),
                await this.getDiscountPolicyByStoreId(storedb.id),
                await this.getBuyingPoliciesByStoreId(storedb.id),
                storedb.recieveOffers);
            return Promise.resolve(store);
        }
        return Promise.resolve(undefined);
    }
        catch(e){
            Logger.error(e)
            return Promise.reject("data base error")
        }
    }
    public async deleteStore(storeId: number): Promise<void>
    {
        try{
        await sequelize.models.Store.destroy(
            {
                where:
                {
                    id: storeId
                }
            }
        )
        }
        catch(e){
            Logger.error(e)
            return Promise.reject("data base error")
        }
    };

    public async getStoreByName(storeName: string):Promise<Store>
    {
        try{
        let storedb = await sequelize.models.Store.findOne(
            {
                where:
                {
                    storeName: storeName
                }
            }
        )

        if(storedb !== null)
        {
            let store = Store.rebuild(storedb,
                await this.getAppointmentByStoreId(storedb.id),
                await DB.getAllProductsOfStore(storedb.id),
                await this.getAllCategories(storedb.id),
                await this.getDiscountPolicyByStoreId(storedb.id),
                await this.getBuyingPoliciesByStoreId(storedb.id),
                storedb.recieveOffers);
            return Promise.resolve(store);
        }
        return Promise.reject("store not found!");
    }
    catch(e){
        Logger.error(e)
        return Promise.reject("data base error")
    }
    }

    private async getBuyingPoliciesByStoreId(storeId: number): Promise<BuyingPolicy>
    {
        try{
            let policies = await sequelize.models.BuyingPolicy.findAll({
                where:{
                    StoreId: storeId
                }
            })
            return BuyingPolicy.rebuild(policies);
        }
        catch(e){
            Logger.error(e)
            return Promise.reject("data base error")
        }
    }

    private async getDiscountPolicyByStoreId(storeId: number): Promise<DiscountPolicy>
    {
        try{
        let discounts = await sequelize.models.DiscountPolicy.findAll({
            where:{
                StoreId: storeId
            }
        })
        return DiscountPolicy.rebuild(discounts);
        }
        catch(e){
            Logger.error(e)
            return Promise.reject("data base error")
        }
    }


    public async getPruductInfoByName(productName: string):Promise<string>
    {
        try{
        let productsdb = await sequelize.models.StoreProduct.findAll({
                where: {
                    name: productName
                },
                include: {all: true}
            })

        var products : any = {}
        products['products']=[]

        for(let product of productsdb)
        {
            products['products'].push({
                'productName': product.name,
                'numberOfRaters': product.numOfRaters,
                'rating': product.productRating,
                'price': product.price,
                'storeName': product.Store.storeName,
                'storeId': product.StoreId,
                'productId': product.id,
                'image': product.image,
                'recieveOffers': product.Store.recieveOffers,
            })

        }
        Logger.log(`Getting products by name answer: ${JSON.stringify(products)}`)
        return Promise.resolve(JSON.stringify(products))
        }
        catch(e){
            Logger.error(e)
            return Promise.reject("data base error")
        }
    }

    public async getPruductInfoByStore(storeName: string):Promise<string>
    {
        try{
            
        let productsdb = await sequelize.models.StoreProduct.findAll(
            {
                include: {all: true}
            },
        )
        var products : any = {}
        products['products']=[]
        for(let product of productsdb)
        {
            if(product.Store.storeName === storeName){
                products['products'].push({
                    'productName': product.name,
                    'numberOfRaters': product.numOfRaters,
                    'rating': product.productRating,
                    'price': product.price,
                    'storeName': product.Store.storeName,
                    'storeId': product.StoreId,
                    'productId': product.id,
                    'image': product.image,
                    'recieveOffers': product.Store.recieveOffers
                })
            }
        }
        Logger.log(`Getting products by name answer: ${JSON.stringify(products)}`)
        return Promise.resolve(JSON.stringify(products))
        }
        catch(e){
            Logger.error(e)
            return Promise.reject("data base error")
        }
    }

    public async getPruductInfoByCategory(category: string): Promise<string>{
        try{
        let productsdb = await sequelize.models.StoreProduct.findAll(
            {
                include: {all: true}
            }
        )
        var products : any = {}
        products['products']=[]
        for(let product of productsdb)
        {
            let categories = await DB.getCategoriesOfProduct(product.id)
            if(categories.includes(category)){
                products['products'].push({
                    'productName': product.name,
                    'numberOfRaters': product.numOfRaters,
                    'rating': product.productRating,
                    'price': product.price,
                    'storeName': product.Store.storeName,
                    'storeId': product.StoreId,
                    'productId': product.id,
                    'image': product.image,
                    'recieveOffers': product.Store.recieveOffers
                })
            }
        }
        Logger.log(`Getting products by category answer: ${JSON.stringify(products)}`)
        return Promise.resolve(JSON.stringify(products))
        }
        catch(e){
            return Promise.reject()
        }
    }

    public async getProductInfoAbovePrice(price: number): Promise<string>{
        try{
        let productsdb = await sequelize.models.StoreProduct.findAll(
            {
                include: {all: true}
            }
        )
        var products : any = {}
        products['products']=[]
        for(let product of productsdb)
        {
            if(product.price > price){
                products['products'].push({
                    'productName': product.name,
                    'numberOfRaters': product.numOfRaters,
                    'rating': product.productRating,
                    'price': product.price,
                    'storeName': product.Store.storeName,
                    'storeId': product.StoreId,
                    'productId': product.id,
                    'image': product.image,
                    'recieveOffers': product.Store.recieveOffers
                })
            }
        }
        Logger.log(`Getting products above price ${price} answer: ${JSON.stringify(products)}`)
        return Promise.resolve(JSON.stringify(products))
        }
        catch(e){
            Logger.error(e)
            return Promise.reject("data base error")
        }
    }

    public async getProductInfoBelowPrice(price: number): Promise<string>{
        try{
        let productsdb = await sequelize.models.StoreProduct.findAll(
            {
                include: {all: true}
            }
        )
        var products : any = {}
        products['products']=[]
        for(let product of productsdb)
        {
            if(product.price < price){
                products['products'].push({
                    'productName': product.name,
                    'numberOfRaters': product.numOfRaters,
                    'rating': product.productRating,
                    'price': product.price,
                    'storeName': product.Store.storeName,
                    'storeId': product.StoreId,
                    'productId': product.id,
                    'image': product.image,
                    'recieveOffers': product.Store.recieveOffers
                })
            }
        }
        Logger.log(`Getting products below price ${price} answer: ${JSON.stringify(products)}`)
        return Promise.resolve(JSON.stringify(products))
        }
        catch(e){
            Logger.error(e)
            return Promise.reject("data base error")
        }
    }

    private async getAppointmentByStoreId(storeId : number) : Promise<Appointment[]>
    {
        try{
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
        catch(e){
            Logger.error(e)
            return Promise.reject("data base error")
        }
    }

    private async getCategory(categoryName: string, storeId:number): Promise<string>
    {
        let category = await sequelize.models.DiscountPolicy.findOne({
            where:{
                name: categoryName,
                StoreId: storeId,
            }
        })
        return category;
    }

    public async getAllCategories(StoreId: number) : Promise<TreeRoot<string>>
    {
        try{
        Logger.log(`getting categories StoreId: ${StoreId}`)
        let categories = await sequelize.models.Category.findAll({
            where: {
                StoreId: StoreId,
            }
        })
        let categiriesTree = new TreeRoot<string>('General');

        while(categories.length !== 0){
            let inserted_categories: string[] = []
            for(let category of categories){
                let leaf = categiriesTree.getChildNode(category.father)
                if (leaf != null){
                    leaf.createChildNode(category.name);
                    inserted_categories.push(category.name)
                }
            }
            categories = categories.filter( (cat: any) => inserted_categories.indexOf(cat.name) == -1)
        }
        return categiriesTree;
        }
        catch(e){
            Logger.error(e)
            return Promise.reject("data base error")
        }

    }

    public async updateStoreRecievesOffers(storeId: number, recieveOffers: boolean): Promise<void>
    {
        try{
        await sequelize.models.Store.update(
            {recieveOffers: recieveOffers},
            {
                where:
                {
                    id: storeId
                }
            } )
        }
        catch(e){
            Logger.error(e)
            return Promise.reject("data base error")
        }
    }

    public async getRecievingOffers(storeId: number): Promise<boolean>
    {
        try{
        let storedb = await sequelize.models.Store.findOne(
            {
                where:
                {
                    id: storeId
                }
            }
        )

        return storedb.recieveOffers;
        }
        catch(e){
            Logger.error(e)
            return Promise.reject("data base error")
        }
    }
    public async getCategoriesOfProduct(productId: number) : Promise<string[]>
    {
        try{
        let productToCategories = await sequelize.models.ProductToCategory.findAll({
            where: {
                StoreProductId: productId,
            }
        })
        return productToCategories.map((p2c: any) => p2c.category)
        }
        catch(e){
            Logger.error(e)
            return Promise.reject("data base error")
        }

    }
    clear: () => void;
    public willFail() : void{
        // this.sequelize_backup = sequelize;
        // set_sequelize(undefined)
    }
    public willSucceed() : void {
        // set_sequelize(this.sequelize_backup)
    }
}