import { SHOULD_RESET_DATABASE, SQLconnector } from '../../config'

export const Sequelize = require('sequelize')
export const Op = Sequelize.Op


//
export const sequelize = new Sequelize(SQLconnector.database, SQLconnector.username, SQLconnector.password, {
    host: SQLconnector.host,
    dialect: SQLconnector.dialect,
    port: SQLconnector.port, // this is the mysql port
    logging: false,
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
const ProductToCategory = require('./models/ProductToCategory')
const MessageHistory = require('./models/MessageHistory')
const LoginStts = require('./models/LoginStats')

export async function initTables (){

     if (SHOULD_RESET_DATABASE)
       await truncate_tables()  
    //   await sequelize.queryInterface.dropAllTables()

    //store connections
    sequelize.models.Store.hasMany(sequelize.models.StoreProduct) // will add storeId to storeProduct
    sequelize.models.StoreProduct.belongsTo(sequelize.models.Store)
    sequelize.models.Store.belongsTo(sequelize.models.Subscriber, {as: 'founder'}) // will add subscriberId (founder) to Store
    sequelize.models.Store.hasMany(sequelize.models.Category)
    sequelize.models.Store.hasMany(sequelize.models.BuyingPolicy)
    sequelize.models.Store.hasMany(sequelize.models.DiscountPolicy)
    sequelize.models.Store.hasMany(sequelize.models.Offer)
    sequelize.models.StoreProduct.hasMany(sequelize.models.Offer)
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
    sequelize.models.Subscriber.hasMany(sequelize.models.Offer)

    // //Appointment conections
    sequelize.models.Appointment.belongsTo(sequelize.models.Subscriber, {as: 'appointer'})
    sequelize.models.Appointment.belongsTo(sequelize.models.Subscriber, {as: 'appointee'})
    sequelize.models.Appointment.belongsTo(sequelize.models.Store)


    //Transaction connections
    sequelize.models.Transaction.hasMany(sequelize.models.TransactionItem)
    sequelize.models.TransactionItem.belongsTo(sequelize.models.Transaction)

    sequelize.models.LoginStats.sync()
    await sequelize.sync()

}

export async function truncate_tables() {
  await sequelize.models.MessageHistory.destroy( { where:{}, truncate:true, cascade:true})
  await sequelize.models.PendingMessage.destroy( { where:{}, truncate:true, cascade:true})
  await sequelize.models.SystemManager.destroy( { where:{}, truncate:true, cascade:true})
  await sequelize.models.Appointment.destroy( { where:{}, truncate:true, cascade:true} )
  
  await sequelize.models.BasketProduct.destroy( { where:{}, truncate:true, cascade:true} )
  await sequelize.models.ShoppingBasket.destroy( { where:{},  cascade:true} )
  await sequelize.models.StoreProduct.destroy( { where:{},  cascade:true} )
  await sequelize.models.ProductToCategory.destroy( { where:{}, truncate:true, cascade:true} )
  await sequelize.models.DiscountPolicy.destroy( { where:{}, truncate:true, cascade:true} )
  await sequelize.models.Category.destroy( { where:{}, truncate:true, cascade:true} )
  await sequelize.models.BuyingPolicy.destroy({ where:{}, truncate:true, cascade:true} )
  await sequelize.models.Store.destroy( { where:{},  cascade:true} )
  await sequelize.models.Subscriber.destroy( { where:{},  cascade:true} )
  await sequelize.models.TransactionItem.destroy( { where:{}, truncate:true, cascade:true} )
  await sequelize.models.Transaction.destroy( { where:{},  cascade:true} )
  
  try{ await sequelize.models.LoginStats.destroy( { where:{}, truncate:true, cascade:true} )}
  catch(e){}
}

