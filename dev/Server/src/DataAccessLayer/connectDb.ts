import { SHOULD_RESET_DATABASE, SQLconnector } from '../../config'

export const Sequelize = require('sequelize')
export const Op = Sequelize.Op


//

export const sequelize = new Sequelize(SQLconnector.database, SQLconnector.username, SQLconnector.password, {
    host: SQLconnector.host,
    dialect: SQLconnector.dialect,
    port: SQLconnector.port, // this is the mysql port
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
const Category = require('./models/Category')
const BuyingPolicy = require('./models/BuyingPolicy')
const DiscountPolicy = require('./models/DiscountPolicy')
const Transaction = require('./models/Transaction')
const TransactionItem = require('./models/TransactionItem')
const ProductToCategory = require('./models/ProductToCategory')
const MessageHistory = require('./models/MessageHistory')
const LoginStts = require('./models/LoginStats')


export async function initTables (){

    if (SHOULD_RESET_DATABASE)
      await truncate_tables()

    //store connections
    sequelize.models.Store.hasMany(sequelize.models.StoreProduct) // will add storeId to storeProduct
    sequelize.models.StoreProduct.belongsTo(sequelize.models.Store)
    sequelize.models.Store.belongsTo(sequelize.models.Subscriber, {as: 'founder'}) // will add subscriberId (founder) to Store
    sequelize.models.Store.hasMany(sequelize.models.Category)
    sequelize.models.Store.hasMany(sequelize.models.BuyingPolicy)
    sequelize.models.Store.hasMany(sequelize.models.DiscountPolicy)
    sequelize.models.StoreProduct.hasMany(sequelize.models.ProductToCategory)
    sequelize.models.Store.hasMany(sequelize.models.ProductToCategory)


    //Subscriber connections
    sequelize.models.Subscriber.hasMany(sequelize.models.PendingMessage)
    sequelize.models.Subscriber.hasMany(sequelize.models.MessageHistory)
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


    //Transaction connections
    sequelize.models.Transaction.hasMany(sequelize.models.TransactionItem)
    sequelize.models.TransactionItem.belongsTo(sequelize.models.Transaction)

    await sequelize.sync()

}

export async function truncate_tables() {
  await sequelize.models.Appointment.truncate()
  await sequelize.models.BasketProduct.truncate()
  await sequelize.models.ProductToCategory.truncate()
  await sequelize.models.MessageHistory.truncate()
  await sequelize.models.LoginStats.truncate()
  await sequelize.models.DiscountPolicy.truncate()
  await sequelize.models.Category.truncate()
  await sequelize.models.BuyingPolicy.truncate()
  await sequelize.models.PendingMessage.truncate()
  await sequelize.models.ShoppingBasket.truncate()
  await sequelize.models.StoreProduct.truncate()
  await sequelize.models.Store.truncate()
  await sequelize.models.SystemManager.truncate()
  await sequelize.models.Subscriber.truncate()
  await sequelize.models.TransactionItem.truncate()
  await sequelize.models.Transaction.truncate()
}

