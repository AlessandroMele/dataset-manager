import { DataTypes, Model, Sequelize } from "sequelize";
import { Singleton } from "../Singleton";
const connection: Sequelize = Singleton.getConnection();

export class LabelTable extends Model {}

LabelTable.init(
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
    width: {
      type: DataTypes.FLOAT,
      defaultValue: null,
    },
    center: {
      type: DataTypes.FLOAT,
      defaultValue: null,
    },
    height: {
      type: DataTypes.FLOAT,
      defaultValue: null,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
  },
  {
    sequelize: connection,
    timestamps: false,
    modelName: "labels",
  }
);
