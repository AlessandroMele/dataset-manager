const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class DatasetTable extends Model {}

DatasetTable.init({
  id: {
    type: Sequelize.INTEGER,
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
  sequelize, 
  modelName: 'datasets' 
});

class ImageTable extends Model {}

ImageTable.init({
  
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  label: {
    type: DataTypes.STRING(30),
    allowNull: false
  },

  path: {
    type: DataTypes.STRING(30),
    allowNull: false
  },

  boundingBoxes: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
}, {
  sequelize, 
  modelName: 'images' 
});

class ModelTable extends Model {}

ModelTable.init({
  
  id: {
    type: Sequelize.INTEGER,
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
  sequelize, 
  modelName: 'models' 
});

class UserTable extends Model {}

UserTable.init({
  
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  email: {
    type: DataTypes.STRING(50),
    allowNull: false
  },

  token: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
},
}, {
  sequelize, 
  modelName: 'users' 
});

DatasetTable.hasMany(ImageTable, {
  foreignKey: 'id'
});
ImageTable.belongsTo(DatasetTable);

DatasetTable.hasMany(ModelTable, {
  foreignKey: 'id'
});
ModelTable.belongsTo(DatasetTable);

UserTable.hasMany(ModelTable, {
  foreignKey: 'id'
});
ModelTable.belongsTo(UserTable);

UserTable.hasMany(DatasetTable, {
  foreignKey: 'id'
});
DatasetTable.belongsTo(UserTable);