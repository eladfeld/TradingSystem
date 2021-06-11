import { DataTypes } from "sequelize";
import { sequelize } from "../connectDb";

const LoginStats = sequelize.define('LoginStats', {
    date:{
        type:DataTypes.DATE,
        primaryKey:true
    },
    guests: {
        type: DataTypes.INTEGER,
        default: 0
    },
    subscribers: {
        type: DataTypes.INTEGER,
        default: 0
    },
    owners: {
        type: DataTypes.INTEGER,
        default: 0
    },
    managers: {
        type: DataTypes.INTEGER,
        default: 0
    },
    system_managers: {
        type: DataTypes.INTEGER,
        default: 0
    }
})
