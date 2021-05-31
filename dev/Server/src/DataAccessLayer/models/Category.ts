import { sequelize } from "../connectDb";
import { DataTypes } from "sequelize";

const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    father: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  })