import { DataTypes, Model } from "sequelize";
import { sequelize } from '../connectDb'

    const Transaction = sequelize.define('Transaction', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },        
      userId: {
        type: DataTypes.INTEGER,
      },
      storeId: {
        type: DataTypes.INTEGER,
      },
      storeName: {
        type: DataTypes.STRING,
      },
      total: {
        type: DataTypes.INTEGER,
      },
      cardNumber: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.INTEGER,
      },
      time: {
        type: DataTypes.BIGINT,
      },
      shipmentId: {
        type: DataTypes.INTEGER,
      },
      paymentId: {
        type: DataTypes.INTEGER,
      }
    })
