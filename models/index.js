const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();

const basename = path.basename(__filename);
const db = {};

// Configuração do Sequelize usando variáveis do .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    define: {
      freezeTableName: true,
      timestamps: false
    }
  }
);

// Importa todos os models da pasta
fs.readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js'
  )
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Importa e registra os novos models
const ReportComentario = require('./ReportComentario')(sequelize, Sequelize.DataTypes);
db.ReportComentario = ReportComentario;

const ReportUsuario = require('./reportUsuario')(sequelize, Sequelize.DataTypes);
db.ReportUsuario = ReportUsuario;

const Advertencia = require('./advertencia')(sequelize, Sequelize.DataTypes);
db.Advertencia = Advertencia;

const ReportGrupo = require('./reportGrupo')(sequelize, Sequelize.DataTypes);
db.ReportGrupo = ReportGrupo;

const ReportEvento = require('./reportEvento')(sequelize, Sequelize.DataTypes);
db.ReportEvento = ReportEvento;

const ReportAmigo = require('./reportAmigo')(sequelize, Sequelize.DataTypes);
db.ReportAmigo = ReportAmigo;

// Associações (caso existam nos models)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;