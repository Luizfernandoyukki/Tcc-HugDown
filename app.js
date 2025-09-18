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
const { Usuario } = require('./models');

const app = express();

// Testa conexão com o banco na inicialização
sequelize.authenticate()
  .then(() => console.log('✅ Conexão com banco estabelecida com sucesso!'))
  .catch(err => console.error('❌ Erro ao conectar no banco:', err));

// Configuração da view engine Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middlewares globais
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "script-src": [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net", 
        "https://cdnjs.cloudflare.com" ,
        "https://unpkg.com/imask"
      ],
    },
  },
})); // segurança
app.use(cors()); // habilita CORS (se necessário)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/perfis', express.static(path.join(__dirname, 'perfis')));
app.use('/post', express.static(path.join(__dirname, 'post')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));

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

// Middleware global para injetar usuário logado e status
app.use(async (req, res, next) => {
  try {
    res.locals.isLoggedIn = !!req.session.isLoggedIn;
    if (req.session.userId) {
      const usuario = await Usuario.findByPk(req.session.userId);
      res.locals.usuario = usuario;
      console.log('[DEBUG] Usuário logado:', usuario ? usuario.email : null);
    } else {
      res.locals.usuario = null;
      console.log('[DEBUG] Nenhum usuário logado');
    }
  } catch (err) {
    console.error('[DEBUG] Erro ao buscar usuário logado:', err);
    res.locals.usuario = null;
  }
  next();
});

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
