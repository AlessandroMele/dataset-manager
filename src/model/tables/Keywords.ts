import { DataTypes, Model, Sequelize } from "sequelize";
import { Singleton } from "../Singleton";
import { DatasetTable } from "./Datasets";
const connection: Sequelize = Singleton.getConnection();

export class KeywordTable extends Model {}

KeywordTable.init(
  {
    keyword: {
      type: DataTypes.STRING(30),
      primaryKey: true,
    },

    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
  },
  {
    sequelize: connection,
    timestamps: false,
    modelName: "keywords",
  }
);
