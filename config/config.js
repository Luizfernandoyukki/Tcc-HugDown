module.exports = {
  development: {
    username: 'root',
    password: '', 
    database: 'HugDown_rede_social',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: false,
      freezeTableName: true
    }
  },
  test: {
    username: 'root',
    password: '',
    database: 'HugDown_rede_social_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: 'root',
    password: '',
    database: 'HugDown_rede_social',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
  }
};