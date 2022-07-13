import {DataTypes, Model, Sequelize} from 'sequelize';
import {Singleton} from "../Singleton";
import {ImageTable} from './Images';
import {ModelTable} from './Models';
const connection: Sequelize = Singleton.getConnection();

export class DatasetTable extends Model {}

DatasetTable.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING(30),
    allowNull: false
  },

  classes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

}, {
  sequelize: connection,
  timestamps: false,
  modelName: 'datasets'
});


DatasetTable.hasMany(ImageTable);

DatasetTable.hasMany(ModelTable);