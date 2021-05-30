import { DataTypes } from "sequelize";
import { sequelize } from "../connectDb";

const PendingMessage = sequelize.define('PendingMessage', {
  message: {
    type: DataTypes.STRING,
    allowNull: false
  }
})
