import { DataTypes } from "sequelize";
import { sequelize } from "../connectDb";

const Store = sequelize.define('Store', {
  id:
  {    
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: false
  },
  storeName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  storeRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  numOfRaters: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  bankAccount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  storeAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  storeClosed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}
)