const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const cron = require('./cron'); // Importa o cron

// Banco de dados (Sequelize)
const sequelize = require('./database/database');

// Importação das rotas
const indexRouter = require('./routes/index');
const { Usuario } = require('./models');
const notificacaoService = require('./controllers/notificacaoService');

const app = express();

// Log global para promessas não tratadas e exceções
process.on('unhandledRejection', (reason, promise) => {
  console.error('[GLOBAL ERROR HANDLER][unhandledRejection]', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[GLOBAL ERROR HANDLER][uncaughtException]', err);
});

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
        "https://unpkg.com/imask",
        "https://unpkg.com"
      ],
      "style-src": [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://unpkg.com"
      ],
      "img-src": [
        "'self'",
        "data:",
        "https://*.tile.openstreetmap.org",
        "https://tile.openstreetmap.org",
        "https://unpkg.com"
      ],
      "connect-src": [
        "'self'",
        "https://nominatim.openstreetmap.org",
        "https://cdn.jsdelivr.net" // <-- Adicionado para liberar fetch do emoji picker
      ]
    },
  },
})); // segurança
app.use(cors()); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração de sessão
app.use(session({
  secret: process.env.SESSION_SECRET,
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
      req.session.usuario = usuario;
    } else {
      res.locals.usuario = null;
      req.session.usuario = null;
    }
  } catch (err) {
    console.error('[DEBUG] Erro ao buscar usuário logado:', err);
    res.locals.usuario = null;
    req.session.usuario = null;
  }
  next();
});

// Carrega e processa o filtro de palavrões uma vez no backend
const blokdepalavroes = require('./public/blokdepalavroes.js');
let palavrasOfensivasGlobal = [];
blokdepalavroes.gerarPalavrasOfensivasAssincrono(() => {
  palavrasOfensivasGlobal = blokdepalavroes.palavrasOfensivas;
  console.log('[MODERATION] Lista de palavras ofensivas carregada no backend:', palavrasOfensivasGlobal.length);
});

// Middleware global para injetar lista de palavras ofensivas
app.use((req, res, next) => {
  res.locals.palavrasOfensivas = palavrasOfensivasGlobal;
  next();
});

// Roda verificação de eventos próximos ao inicializar o app
cron.verificarEventosProximos();

// Remova o middleware de eventos próximos (deixe só o cron rodando externamente)

// Middleware para interceptar criações relevantes e notificar (exemplo para amizade)
app.use(async (req, res, next) => {
  // Só intercepta POSTs relevantes
  if (req.method === 'POST') {
    // Exemplo: solicitação de amizade
    if (req.path.startsWith('/amizades/solicitar')) {
      // Você pode acessar req.body aqui e chamar notificacaoService se necessário
      // (mas normalmente já está sendo chamado no controller/rota)
    }
    // Adicione outros casos conforme necessário
  }
  next();
});

// Rotas
app.use('/', indexRouter);
app.use('/webpush', require('./routes/webpush'));
app.get('/favicon.ico', (req, res) => res.status(204));
// 404 handler
app.use((req, res, next) => {
  const err = new Error('Página não encontrada');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  // Log detalhado de erro global
  try {
    console.error('[GLOBAL ERROR HANDLER]');
    console.error('URL:', req.originalUrl);
    console.error('Método:', req.method);
    console.error('Headers:', req.headers);
    console.error('Body:', req.body);
    console.error('Error:', err);
    if (err && err.stack) {
      console.error('Stack:', err.stack);
    }
  } catch (logErr) {
    // Se der erro no log, mostra mesmo assim
    console.error('[GLOBAL ERROR HANDLER][LOG ERROR]', logErr);
  }
  if (res.headersSent) {
    return next(err);
  }
  // Garante que sempre renderiza a página de erro com detalhes
  res.status(err.status || 500);
  res.render('error', {
    error: {
      status: err.status || 500,
      message: err.message || 'Erro interno do servidor',
      stack: err.stack || '',
      type: err.name || '',
      ...err // inclui outros campos customizados
    },
    title: 'Erro',
    user: req.user
  });
});

// Log de rotas carregadas
console.log('[DEBUG][ROUTES] Rotas carregadas:', app._router.stack.filter(r => r.route).map(r => r.route.path));

module.exports = app;
