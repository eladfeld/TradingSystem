import { DataTypes } from "sequelize";
import { sequelize } from "../connectDb";


const ProductToCategory = sequelize.define('ProductToCategory', {
    category: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })