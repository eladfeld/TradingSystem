import { DataTypes } from "sequelize";
import { sequelize } from "../connectDb";


const Appointment = sequelize.define('Appointment', {
    permissionsMask:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isManager:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})