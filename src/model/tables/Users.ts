import {DataTypes, Model, Sequelize} from 'sequelize';
import {Singleton} from "../Singleton";
const connection: Sequelize = Singleton.getConnection();

export class UserTable extends Model {}

UserTable.init({

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },

  username: {
    type: DataTypes.STRING(30),
    allowNull: false
  },

  password: {
    type: DataTypes.STRING(256),
    allowNull: false
  },

  token: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 100
  },

  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
}, {
  sequelize: connection,
  timestamps: false,
  modelName: 'users'
});