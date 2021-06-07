import { DataTypes } from "sequelize";
import { sequelize } from "../connectDb";


const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })