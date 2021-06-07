import { DataTypes } from "sequelize";
import { sequelize } from "../connectDb"

const StoreProduct = sequelize.define('StoreProduct', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    productRating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    numOfRaters: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    image:{
      type: DataTypes.STRING,
      defaultValue: ""
    }
  })