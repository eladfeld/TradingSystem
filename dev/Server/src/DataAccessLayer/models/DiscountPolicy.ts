import { sequelize } from "../connectDb";
import { DataTypes } from "sequelize";


const DiscountPolicy = sequelize.define('DiscountPolicy', {
    object:{
      type: DataTypes.STRING,
      allowNull: false
    },

  })