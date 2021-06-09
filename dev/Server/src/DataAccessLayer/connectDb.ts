import { SQLconnector } from '../../config'
export const Sequelize = require('sequelize')
export const Op = Sequelize.Op


//
SQLconnector
export const sequelize = new Sequelize(SQLconnector.database, SQLconnector.username, SQLconnector.password, {
    host: SQLconnector.host,
    dialect: SQLconnector.dialect,
    port: SQLconnector.port, // this is the mysql port
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
const Transaction = require('./models/Transaction')
const TransactionItem = require('./models/TransactionItem')
const Offer = require('./models/Offer')

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
    sequelize.models.Store.hasMany(sequelize.models.Offer)
    sequelize.models.StoreProduct.hasMany(sequelize.models.Offer)


    //Subscriber connections
    sequelize.models.Subscriber.hasMany(sequelize.models.PendingMessage)
    sequelize.models.Subscriber.hasMany(sequelize.models.ShoppingBasket)
    sequelize.models.ShoppingBasket.hasMany(sequelize.models.BasketProduct)
    sequelize.models.SystemManager.belongsTo(sequelize.models.Subscriber)
    sequelize.models.BasketProduct.belongsTo(sequelize.models.ShoppingBasket)
    sequelize.models.BasketProduct.belongsTo(sequelize.models.StoreProduct)
    sequelize.models.ShoppingBasket.belongsTo(sequelize.models.Store)
    sequelize.models.Subscriber.hasMany(sequelize.models.Offer)

    // //Appointment conections
    sequelize.models.Appointment.belongsTo(sequelize.models.Subscriber, {as: 'appointer'})
    sequelize.models.Appointment.belongsTo(sequelize.models.Subscriber, {as: 'appointee'})
    sequelize.models.Appointment.belongsTo(sequelize.models.Store)


    //Transaction connections
    sequelize.models.Transaction.hasMany(sequelize.models.TransactionItem)
    sequelize.models.TransactionItem.belongsTo(sequelize.models.Transaction)

    await sequelize.sync()

}
