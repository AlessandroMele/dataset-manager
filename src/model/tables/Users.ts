import { DataTypes, Model, Sequelize } from "sequelize";
import { Singleton } from "../Singleton";
import { DatasetTable } from "./Datasets";
import { ModelTable } from "./Models";
const connection: Sequelize = Singleton.getConnection();

export class UserTable extends Model {}

UserTable.init(
  {
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },

    token: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 100,
    },

    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
  },
  {
    sequelize: connection,
    timestamps: false,
    modelName: "users",
  }
);

UserTable.hasMany(DatasetTable, { foreignKey: "user" });

UserTable.hasMany(ModelTable, { foreignKey: "user" });
