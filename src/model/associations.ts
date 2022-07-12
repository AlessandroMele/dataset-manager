import {ImageTable} from "./tables/Images";
import {ModelTable} from "./tables/Models";
import {UserTable} from "./tables/Users";
import {DatasetTable} from "./tables/Datasets";

DatasetTable.hasMany(ImageTable, {
    foreignKey: 'id'
});

DatasetTable.hasMany(ModelTable, {
    foreignKey: 'id'
});

DatasetTable.belongsTo(UserTable);

ImageTable.belongsTo(DatasetTable);

ModelTable.belongsTo(DatasetTable);

ModelTable.belongsTo(UserTable);

UserTable.hasMany(DatasetTable, {
    foreignKey: 'id'
});

UserTable.hasMany(ModelTable, {
    foreignKey: 'id'
});