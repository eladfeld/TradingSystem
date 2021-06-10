import { DataTypes } from "sequelize";
import { sequelize } from "../connectDb";


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
