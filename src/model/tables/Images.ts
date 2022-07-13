import { DataTypes, Model, Sequelize } from "sequelize";
import { Singleton } from "../Singleton";
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
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    path: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    boundingBoxes: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    sequelize: connection,
    timestamps: false,
    modelName: "images",
  }
);
