import {DataTypes, Model, Sequelize} from 'sequelize';
import {Singleton} from "../Singleton";
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
    allowNull: true
  },

}, {
  sequelize: connection,
  timestamps: false,
  modelName: 'datasets'
});