import { sequelize } from "../connectDb";
import { DataTypes } from "sequelize";


const BuyingPolicy = sequelize.define('BuyingPolicy', {
    object:{
      type: DataTypes.STRING,
      allowNull: false
    },

  })