import { DataTypes, Model, Sequelize } from "sequelize";
import { Singleton } from "../Singleton";
import { LabelTable } from "./Labels";
const connection: Sequelize = Singleton.getConnection();

export class ImageTable extends Model {}

ImageTable.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    label: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    path: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
  },
  {
    sequelize: connection,
    timestamps: false,
    modelName: "images",
  }
);

ImageTable.hasMany(LabelTable, { foreignKey: "id" });