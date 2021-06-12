import { DataTypes } from "sequelize";
import { sequelize } from "../connectDb"

const Offer = sequelize.define('Offer', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    offerPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    counterPrice: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    offerStatus:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownersAccepted:{
      type: DataTypes.STRING,
      allowNull: false,
    }
  })