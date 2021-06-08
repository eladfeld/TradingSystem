import { DataTypes } from "sequelize";
import { sequelize } from "../connectDb";


const DiscountPolicy = sequelize.define('DiscountPolicy', {
  id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  discount:{
      type: DataTypes.JSON,
      allowNull: false
  }
})
