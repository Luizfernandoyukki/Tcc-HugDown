const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');

// Banco de dados (Sequelize)
const sequelize = require('./database/database');

// Importação das rotas
const indexRouter = require('./routes/index');

const app = express();

// Testa conexão com o banco na inicialização
sequelize.authenticate()
  .then(() => console.log('✅ Conexão com banco estabelecida com sucesso!'))
  .catch(err => console.error('❌ Erro ao conectar no banco:', err));

// Configuração da view engine Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middlewares globais
app.use(helmet()); // segurança
app.use(cors()); // habilita CORS (se necessário)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração de sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'sua_chave_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // só https em prod
    maxAge: 1000 * 60 * 60 * 24 // 1 dia
  }
}));

// Rotas
app.use('/', indexRouter);
app.get('/favicon.ico', (req, res) => res.status(204));

// 404 handler
app.use((req, res, next) => {
  const err = new Error('Página não encontrada');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
