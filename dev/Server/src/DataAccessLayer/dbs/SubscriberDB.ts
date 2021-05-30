import { Appointment } from "../../DomainLayer/user/Appointment";
import { ManagerAppointment } from "../../DomainLayer/user/ManagerAppointment";
import { OwnerAppointment } from "../../DomainLayer/user/OwnerAppointment";
import { Permission } from "../../DomainLayer/user/Permission";
import { ShoppingBasket } from "../../DomainLayer/user/ShoppingBasket";
import { ShoppingCart } from "../../DomainLayer/user/ShoppingCart";
import { Subscriber } from "../../DomainLayer/user/Subscriber";
import { Logger } from "../../Logger";
import { sequelize } from "../connectDb";
import { subscriberDB } from "../DBinit";
import { iSubscriberDB } from "../interfaces/iSubscriberDB";


export class SubscriberDB implements iSubscriberDB
{


    public addSubscriber(username: string, password: string, age: number): void
    {
        let subscriber = new Subscriber(username, password, age);
        sequelize.models.Subscriber.create({
            id: subscriber.getUserId(),
            username:username,
            password: password,
            age: age
        })
    }

    public addSystemManager (subscriber: Subscriber): void 
    {
        sequelize.models.SystemManager.create({
            subscriberId: subscriber.getUserId()
        })
    }

    public async isSystemManager(subscriberId: number) : Promise<boolean> {
        
        let sys_manager = await sequelize.models.SystemManager.findOne({where : {subscriberId : subscriberId}})
        if (sys_manager === null )
        {
            Logger.log(`SubscriberDb.isSystemManager ${subscriberId} => not system manager`)
            return Promise.reject(`${subscriberId} not system manager`)
        }
        Logger.log(`SubscriberDb.isSystemManager ${subscriberId} => true`)
        return Promise.resolve(true)
    }

    public async getSubscriberById(userId: number): Promise<Subscriber>
    { 
        let subscriber = await sequelize.models.Subscriber.findOne({
            where:
            {
                id: userId
            }
        })
        if (subscriber === null )
        {
            Logger.log(`SubscriberDb.getSubscriberById ${userId} => not found`)
            return Promise.reject(`${userId} not found`)
        }
        Logger.log(`SubscriberDb.getSubscriberById ${userId} => ${subscriber}`)
        return Promise.resolve(subscriber)        
    }


    public static async getSubscriber(userId: number) : Promise<Subscriber>
    {
        let subscriber = await sequelize.models.Subscriber.findOne({
            where: {
                id: userId
            }
        });
        if (subscriber === null )
        {
            Logger.log(`SubscriberDb.getSubscriberById ${userId} => not found`)
            return Promise.reject(`${userId} not found`)
        }
        let subscriberD : Subscriber = Subscriber.rebuildSubscriber(subscriber.id, subscriber.username, subscriber.password, subscriber.age, await this.getMessages(subscriber.id), await this.getAppointmentsByAppointee(subscriber.id), await this.getShoppingCart(subscriber.id));
        return subscriberD;
    }

    private static async getMessages(SubscriberId: number)
    {
        let messages = await sequelize.models.PendingMessage.findAll({
            where: {
                SubscriberId
            }
        });

        return messages.map((message: any) => message.message)

    }

    private static async getShoppingCart(SubscriberId: number)
    {
        let baskets = await sequelize.models.ShoppingBasket.findAll({
            where:{
                SubscriberId
            }
        });

        return ShoppingCart.rebuildShoppiongCart(baskets.map(async (basket: any) => await this.getShoppingBasket(basket.subscriberId, basket.storeId)))
    }

    private static async getShoppingBasket(subscriberId: number, storeId: number)
    {
        let products = await sequelize.models.BasketProduct.findAll({
            where:{
                subscriberId,
                storeId
            }
        });

        let productMap = new Map <number, number> ();
        products.map((product: any) => productMap.set(product.productId, product.quantity))
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
        // TODO:uplaod entire subscriber
        return Promise.resolve(subscriber)     
    }

    private static async getAppointmentsByAppointee(appointee: number): Promise<Appointment[]>{
        let appointments = await sequelize.models.Appointment.findAll({
            where:{
                appointeeId: appointee
            }
        })
        Logger.log(`getting appointments response ${JSON.stringify(appointments)}`)
        let apps: Appointment[] = appointments.map(
            (app : any) => app.isManager ?
            new ManagerAppointment(app.appointerId, app.StoreId, app.appointeeId, new Permission(app.permissionsMask)) :
            new OwnerAppointment(app.appointerId, app.StoreId, app.appointeeId, new Permission(app.permissionsMask)))
        return apps;
    }

    public addAppointment(userId: number, appointment: Appointment): Promise<void>
    {
        sequelize.models.Appointment.create({
            appointerId: appointment.appointer.getUserId(),
            StoreId: appointment.store.getStoreId(),
            appointeeId: appointment.appointee.getUserId(),
            permissionsMask: appointment.permission.getPermissions(),
            isManager: appointment.isManager()
        })
        return Promise.resolve();
    }

    public addProduct(subscriberId: number, storeId: number, productId: number, quantity: number): void
    {
        sequelize.models.BasketProduct.create({
            userId: subscriberDB,
            storeId: storeId,
            quantity: quantity,
            productId: productId
        })
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

    public deleteBasket(userId: number, storeId: number)
    {
        sequelize.models.BasketProduct.destroy(
            {
                where:
                {
                    userId,
                    storeId
                }
            }
        )
        sequelize.models.ShoppingBasket.destory(
            {
                where:
                {
                    userId,
                    storeId
                }
            }
        )
    }

    public updateCart(subscriberId: number, storeId: number, productId: number, newQuantity: number): void
    {
        sequelize.models.BasketProduct.update(
            {quantity: newQuantity},
            {
                where:
                {
                    subscriberId: subscriberId,
                    storeId: storeId,
                    productId: productId
                }
            } )
    }

    public clear() {}
    
}