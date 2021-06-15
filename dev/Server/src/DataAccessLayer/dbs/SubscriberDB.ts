import { subscribe } from "../../CommunicationLayer/Router";
import { Appointment } from "../../DomainLayer/user/Appointment";
import { ManagerAppointment } from "../../DomainLayer/user/ManagerAppointment";
import { OwnerAppointment } from "../../DomainLayer/user/OwnerAppointment";
import { Permission } from "../../DomainLayer/user/Permission";
import { ShoppingBasket } from "../../DomainLayer/user/ShoppingBasket";
import { ShoppingCart } from "../../DomainLayer/user/ShoppingCart";
import { Subscriber } from "../../DomainLayer/user/Subscriber";
import { Logger } from "../../Logger";
import { sequelize } from "../connectDb";
import { iSubscriberDB } from "../interfaces/iSubscriberDB";


export class subscriberDB implements iSubscriberDB
{
    public async addMessageToHistory(message: string, userId: number): Promise<void>
    {
        try{
            await sequelize.models.MessageHistory.create({
                message: message,
                SubscriberId: userId
            })
            return Promise.resolve()
        }
        catch(e)
        {
            return Promise.reject("message with the same id is already exists")
        }
    }
    
    public willFail= () =>{
        throw new Error("can not force failure outside of test mode")
    }
    public willSucceed= () =>{
        throw new Error("can not force success outside of test mode")
    }

    //add functions:

    public async addSubscriber(username: string, password: string, age: number) : Promise<void>
    {
        let subscriber = new Subscriber(username, password, age);
        try{
            await sequelize.models.Subscriber.create({
                id: subscriber.getUserId(),
                username:username,
                password: password,
                age: age
            })
            return Promise.resolve();
        }
        catch(e)
        {
            return Promise.reject(e);
        }

    }

    public async addSystemManager (subscriber: Subscriber): Promise<void>
    {
        try{
            await sequelize.models.Subscriber.create({
                id: subscriber.getUserId(),
                username: subscriber.getUsername(),
                password: subscriber.getPassword(),
                age : subscriber.getAge()
            })
            sequelize.models.SystemManager.create({
                SubscriberId: subscriber.getUserId()
            })
            return Promise.resolve();
        }
        catch(e)
        {
            return Promise.reject(e);
        }

    }

    public async addAppointment(userId: number, appointment: Appointment): Promise<void>
    {
        try{
            await sequelize.models.Appointment.create({
                appointerId: appointment.appointer,
                StoreId: appointment.getStoreId(),
                appointeeId: appointment.appointee,
                permissionsMask: appointment.permission.getPermissions(),
                isManager: appointment.isManager()
            })
            return Promise.resolve();
        }
        catch(e)
        {
            return Promise.reject("appointment with the same id is alreay exists")
        }
    }


    public async addProductToCart(subscriberId: number, storeId: number, productId: number, quantity: number): Promise<void>
    {

        let basket = await sequelize.models.ShoppingBasket.findOne({
            where:{
                SubscriberId: subscriberId,
                StoreId: storeId
            }
        });
        if(basket === null)
        {
            try{
                basket = await sequelize.models.ShoppingBasket.create({
                    SubscriberId: subscriberId,
                    StoreId: storeId
                })
            }
            catch(e)
            {
                return Promise.reject("shopping basket with the same id is already exists");
            }

        }

        let product = await sequelize.models.BasketProduct.findOne({
            where:{
                productId: productId,
                ShoppingBasketId: basket.id
        }})

        if(product === null)
        {
            try{
                await sequelize.models.BasketProduct.create({
                    ShoppingBasketId: basket.id,
                    quantity: quantity,
                    productId: productId
                })
            }
            catch(e)
            {
                return Promise.reject("product with the same id is already exists")
            }

        }
        else
        {
            return this.updateCart(subscriberId, storeId, productId, product.quantity + quantity)
        }
        return Promise.resolve()
    }

    public async addPendingMessage(userId: number, message: string): Promise<void>
    {
        try{
            await sequelize.models.PendingMessage.create({
                message: message,
                SubscriberId: userId
            })
            return Promise.resolve()
        }
        catch(e)
        {
            return Promise.reject("message with the same id is already exists")
        }
    }

    //get functions:


    public async getLastUserId() : Promise<number>
    {
        let lastId = await sequelize.models.Subscriber.max('id')
        if (Number.isNaN(lastId))
            return 0;
        return lastId + 1
    }



    public async isSystemManager(subscriberId: number) : Promise<boolean> {
        
        let sys_manager = await sequelize.models.SystemManager.findOne({where : {SubscriberId : subscriberId}})
        if (sys_manager === null )
        {
            Logger.log(`SubscriberDb.isSystemManager ${subscriberId} => not system manager`)
            return Promise.resolve(false)
        }
        Logger.log(`SubscriberDb.isSystemManager ${subscriberId} => true`)
        return Promise.resolve(true)
    }

    public async getSubscriberById(userId: number) : Promise<Subscriber>
    {
        let subscriber = await sequelize.models.Subscriber.findOne({
            where: {
                id: userId
            }
        });
        if (subscriber === null )
        {
            Logger.log(`SubscriberDb.getSubscriberById ${userId} => not found, ${subscriber.username}`)
            return Promise.reject(`${userId} not found`)
        }
        let subscriberD : Subscriber = Subscriber.rebuildSubscriber(subscriber.id, subscriber.username, subscriber.password, subscriber.age, await this.getMessages(subscriber.id), await this.getAppointmentsByAppointee(subscriber.id), await this.getShoppingCart(subscriber.id));
        return subscriberD;
    }

    private async getMessages(SubscriberId: number)
    {
        let messages = await sequelize.models.PendingMessage.findAll({
            where: {
                SubscriberId
            }
        });

        return messages.map((message: any) => message.message)
    }

    private async getShoppingCart(SubscriberId: number): Promise<ShoppingCart>
    {
        let baskets = await sequelize.models.ShoppingBasket.findAll({
            where:{
                SubscriberId
            }
        });
        let cartp: Promise<ShoppingBasket>[] =  baskets.map(async (basket: any) => await this.getShoppingBasket(basket.id, basket.StoreId))
        return new Promise((resolve,reject) =>{
            Promise.all(cartp).then( cart => {
                resolve(ShoppingCart.rebuildShoppingCart(cart))
            })
            .catch (error => reject(error))
        })
    }

    private async getShoppingBasket(basketId: number, storeId: number)
    { 
        let products = await sequelize.models.BasketProduct.findAll(
            {
                where:
                {
                    ShoppingBasketId: basketId
                }
            }
        )
        let productMap = new Map <number, number> ();
        products.map( (product: any) => productMap.set(product.productId, product.quantity))
        return ShoppingBasket.rebuildShoppingBasket(storeId, productMap);
    }


    public async getSubscriberByUsername(username: string) : Promise<Subscriber>
    {
        let subscriber = await sequelize.models.Subscriber.findOne({ where:{ username: username } });
        if (subscriber === null )
        {
            Logger.log(`SubscriberDb.getSubscriberByUsername ${username} => not found`)
            return Promise.reject(`${username} not found`)
        }
        Logger.log(`SubscriberDb.getSubscriberByUsername ${username} => ${subscriber}`)
        let appointements : Appointment[] = await this.getAppointmentsByAppointee(subscriber.id)
        let subscriberD : Subscriber = Subscriber.rebuildSubscriber(subscriber.id, subscriber.username, subscriber.password, subscriber.age, await this.getMessages(subscriber.id), appointements, await this.getShoppingCart(subscriber.id));
        return subscriberD;    
    }

    private async getAppointmentsByAppointee(appointee: number): Promise<Appointment[]>{
        let appointments = await sequelize.models.Appointment.findAll({
            where:{
                appointeeId: appointee
            },
        })
        Logger.log(`getting appointments response ${JSON.stringify(appointments)}`)
        let apps: Appointment[] = appointments.map(
            (app : any) =>              
            app.isManager ?
            new ManagerAppointment(app.appointerId, app.StoreId, app.appointeeId, new Permission(app.permissionsMask)) :
            new OwnerAppointment(app.appointerId, app.StoreId, app.appointeeId, new Permission(app.permissionsMask)))

        return apps;
    }

    public async getAppointment(userId: number, storeId: number): Promise<Appointment>
    {
        let app = await sequelize.models.Appointment.findOne({
            where:{
                SubscriberId: userId,
                storeId: storeId
            }
        })
        let appoint: Appointment;
        if(app.isManager)
            appoint = new ManagerAppointment(app.appointerId, app.StoreId, app.appointeeId, new Permission(app.permissionsMask))
        else appoint = new OwnerAppointment(app.appointerId, app.StoreId, app.appointeeId, new Permission(app.permissionsMask))
        Logger.log(`getting appointments by store id ${storeId} response ${JSON.stringify(app)}`)
        return appoint;
    }


    //delete functions:

    public async deleteBasket(userId: number, storeId: number)
    {
        let basket = await sequelize.models.ShoppingBasket.findOne({
            where:{
                SubscriberId: userId,
                StoreId: storeId
            }
        });

        let basketId = basket.id;
        await sequelize.models.BasketProduct.destroy(
            {
                where:
                {
                    ShoppingBasketId : basketId,
                }
            }
        )
        await sequelize.models.ShoppingBasket.destroy(
            {
                where:
                {
                    SubscriberId : userId,
                    StoreId :storeId
                }
            }
        )
        return Promise.resolve()
    }

    public async deleteAppointment(appointee: number, appointer: number, storeId: number)
    {
        await sequelize.models.Appointment.destroy(
            {
                where:
                {
                    appointeeId: appointee,
                    appointerId: appointer,
                    StoreId: storeId
                }
            }
        )
    }

    public async deletePendingMessages(userId: number): Promise<void>
    {
        await sequelize.models.PendingMessage.destroy(
            {
                where:
                {
                    SubscriberId: userId
                }
            }
        )
    }


    //update functions:

    public async updateCart(subscriberId: number, storeId: number, productId: number, newQuantity: number): Promise<void>
    {

        let basket = await sequelize.models.ShoppingBasket.findOne({
            where:{
                SubscriberId: subscriberId,
                StoreId: storeId
            }
        });
        await sequelize.models.BasketProduct.update(
            {quantity: newQuantity},
            {
                where:
                {
                    ShoppingBasketId: basket.id,
                    productId: productId
                }
            } )
        return Promise.resolve()
    }

    
    public async updatePermission(storeId: number, managerToEditId: number,permissionMask:number)
    {
        await sequelize.models.Appointment.update(
        {
            permissionsMask: permissionMask
        },
            {
            where:
            {
                StoreId: storeId,
                appointeeId: managerToEditId
            }
        })
    }

    public clear() {}
    
}