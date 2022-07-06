const { Sequelize } = require('sequelize');
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', function(req, res, next) {
    const sequelize = new Sequelize(process.env.DB_NAME,
        process.env.DB_USER, process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            dialect: 'mysql'
        });
    sequelize.authenticate().then(function(errors) { console.log(errors);});
    res.send('It works!');
});

app.listen(8080, () => {
  console.log('Ready for accepting requests on port 8080.');
});