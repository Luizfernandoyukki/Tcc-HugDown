// database/database.js
const { Sequelize } = require('sequelize');
const config = require('../config/config');

// Ambiente (default = development)
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Criando a conexão com Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: dbConfig.define
  }
);

module.exports = sequelize;
