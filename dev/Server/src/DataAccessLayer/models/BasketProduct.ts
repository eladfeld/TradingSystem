import { DataTypes } from "sequelize";
import { sequelize } from "../connectDb";


const BasketProduct = sequelize.define('BasketProduct', {
  productId:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity:{
    type: DataTypes.INTEGER,
    allowNull: false
  }
})
