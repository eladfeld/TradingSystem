import { DataTypes } from "sequelize";
import { sequelize } from "../connectDb";


const BuyingPolicy = sequelize.define('BuyingPolicy', {
  id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name:{
      type: DataTypes.STRING,
      allowNull: false
  },
  predicate:{
      type: DataTypes.JSON,
      allowNull: false
  }
})
