export const Sequelize = require('sequelize')
export const Op = Sequelize.Op



export const sequelize = new Sequelize('T0fWZ940xw', 'T0fWZ940xw', 'ppAkeHJWsg', {
    host: 'remotemysql.com',
    dialect: 'mysql',
    port: 3306, // this is the mysql port
    // logging: true,
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
const Category = require('./models/Category')
const BuyingPolicy = require('./models/BuyingPolicy')
const DiscountPolicy = require('./models/DiscountPolicy')
export async function initTables (){

    //TODO:delete when finshed working on db
    await sequelize.queryInterface.dropAllTables()
    //store connections
    sequelize.models.Store.hasMany(sequelize.models.StoreProduct) // will add storeId to storeProduct
    sequelize.models.StoreProduct.belongsTo(sequelize.models.Store)
    sequelize.models.Store.belongsTo(sequelize.models.Subscriber, {as: 'founder'}) // will add subscriberId (founder) to Store
    sequelize.models.Store.hasMany(sequelize.models.Category)
    // sequelize.models.StoreProduct.hasMany(sequelize.models.Category)
    sequelize.models.Store.hasMany(sequelize.models.BuyingPolicy)
    sequelize.models.Store.hasMany(sequelize.models.DiscountPolicy)


    //Subscriber connections
    sequelize.models.Subscriber.hasMany(sequelize.models.PendingMessage)
    sequelize.models.Subscriber.hasMany(sequelize.models.ShoppingBasket)
    sequelize.models.ShoppingBasket.hasMany(sequelize.models.BasketProduct)
    sequelize.models.SystemManager.belongsTo(sequelize.models.Subscriber)
    sequelize.models.BasketProduct.belongsTo(sequelize.models.ShoppingBasket)
    sequelize.models.BasketProduct.belongsTo(sequelize.models.StoreProduct)
    sequelize.models.ShoppingBasket.belongsTo(sequelize.models.Store)

    // //Appointment conections
    sequelize.models.Appointment.belongsTo(sequelize.models.Subscriber, {as: 'appointer'})
    sequelize.models.Appointment.belongsTo(sequelize.models.Subscriber, {as: 'appointee'})
    sequelize.models.Appointment.belongsTo(sequelize.models.Store)
    await sequelize.sync()

}
