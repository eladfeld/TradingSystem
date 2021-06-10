import { DataTypes } from "sequelize";
import { sequelize } from "../connectDb";

const MessageHistory = sequelize.define('MessageHistory', {
  message: {
    type: DataTypes.STRING,
    allowNull: false
  }
})
