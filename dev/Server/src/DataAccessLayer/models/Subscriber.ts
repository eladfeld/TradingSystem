import { DataTypes, Model } from "sequelize";
import { sequelize } from '../connectDb'

    const Subscriber = sequelize.define('Subscriber', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },        
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      age:{
        type: DataTypes.INTEGER,
        allowNull: false
      }
    })
