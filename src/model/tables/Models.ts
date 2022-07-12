import {DataTypes, Model, Sequelize} from 'sequelize';
import {Singleton} from "../Singleton";
const connection: Sequelize = Singleton.getConnection();

export class ModelTable extends Model {}

ModelTable.init({

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING(30),
    allowNull: false
  },

  path: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  datasetId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

}, {
  sequelize: connection,
  timestamps: false,
  modelName: 'models'
});