import { DataTypes, Model } from "sequelize";
import { sequelize } from '../connectDb'

    const TransactionItem = sequelize.define('TransactionItem', {
      ProductId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },        
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    })
