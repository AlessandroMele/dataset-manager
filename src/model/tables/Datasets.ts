import {DataTypes, Model, Sequelize} from "sequelize";
import {Singleton} from "../Singleton";
import {ImageTable} from "./Images";
import {ModelTable} from "./Models";
import {KeywordTable} from "./Keywords";
const connection: Sequelize = Singleton.getConnection();

export class DatasetTable extends Model {}

DatasetTable.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    classes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
  },
  {
    sequelize: connection,
    timestamps: false,
    paranoid: true,
    modelName: "datasets",
  }
);

DatasetTable.hasMany(ImageTable, {foreignKey: "dataset"});

DatasetTable.hasMany(ModelTable, {foreignKey: "dataset"});

DatasetTable.hasMany(KeywordTable, {foreignKey: "dataset"});
