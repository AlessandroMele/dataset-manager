import { DataTypes, Model, Sequelize } from "sequelize";
import { Singleton } from "../Singleton";
const connection: Sequelize = Singleton.getConnection();

export class ModelTable extends Model {}

ModelTable.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    datasetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    path: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    sequelize: connection,
    timestamps: true,
    paranoid: true,
    modelName: "models",
  }
);
