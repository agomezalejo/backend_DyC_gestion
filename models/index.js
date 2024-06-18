'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.RAILWAY_ENVIRONMENT_NAME || process.env.NODE_ENV || 'development';
const config = (env === 'development' || env === 'test') ? require(__dirname + '/../config/config.json')[env] : process.env;
const db = {};

let sequelize;

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
  let database = config.DATABASE || config.database;
  let username = config.USERBD || config.username;
  let password = config.PASSBD || config.password;
  sequelize = new Sequelize(database, username, password, {
    host: config.HOSTBD|| config.host,
    dialect: config.DIALECTBD || config.dialect,
    port: config.PORTBD || config.port
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}



fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
