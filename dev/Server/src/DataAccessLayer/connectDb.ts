export const Sequelize = require('sequelize')
export const Op = Sequelize.Op



export const sequelize = new Sequelize('db', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306, // this is the mysql port
    logging: true,
    define: {
      timestamps: false
    }
  });

// Register and wrap your models:
const Subscriber = require('./models/Subscriber')
const PendingMessage = require('./models/PendingMessage')
const CartProduct = require('./models/BasketProduct')
const ShoppingBasket = require('./models/ShoppingBasket')
const SystemManagersCache = require('./models/SystemManager')
const Store = require('./models/Store')
const Appointment = require('./models/Appointment')
const StoreProduct = require('./models/StoreProduct')
export async function initTables (){
    console.log(sequelize.models)
    //store connections
    // sequelize.models.Store.hasMany(sequelize.models.StoreProduct) // will add storeId to storeProduct
    // sequelize.models.Store.belongsTo(sequelize.models.Subscriber) // will add subscriberId (founder) to Store
    // sequelize.models.Store.hasMany(sequelize.models.StoreProduct)
    // sequelize.models.Product.hasMany(sequelize.models.StoreProduct)
    // sequelize.models.Store.hasMany(sequelize.models.Category)
    // sequelize.models.StoreProduct.hasMany(sequelize.models.Category)
    // sequelize.models.Store.hasMany(sequelize.models.BuyingPolicy)
    // sequelize.models.Store.hasMany(sequelize.models.DiscountPolicy)


    //Subscriber connections
    sequelize.models.Subscriber.hasMany(sequelize.models.PendingMessage)
    sequelize.models.Subscriber.hasMany(sequelize.models.ShoppingBasket)
    sequelize.models.ShoppingBasket.hasMany(sequelize.models.BasketProduct)
    sequelize.models.SystemManager.belongsTo(sequelize.models.Subscriber)
    sequelize.models.BasketProduct.belongsTo(sequelize.models.ShoppingBasket)
    sequelize.models.BasketProduct.belongsTo(sequelize.models.StoreProduct)
    sequelize.models.ShoppingBasket.belongsTo(sequelize.models.Store)

    // //Appointment conections
    // sequelize.models.Appointment.belongsTo(sequelize.models.Subscriber, {as: 'appointer'})
    // sequelize.models.Appointment.belongsTo(sequelize.models.Subscriber, {as: 'appointee'})
    // sequelize.models.Appointment.belongsTo(sequelize.models.Store)
    await sequelize.sync()

}
