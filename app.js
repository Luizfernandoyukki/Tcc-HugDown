const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

// Importação de todas as rotas
const indexRouter = require('./routes/index');
const usuariosRouter = require('./routes/usuarios');
const categoriasRouter = require('./routes/categorias');
const tagsRouter = require('./routes/tags');
const postagensRouter = require('./routes/postagens');
const comentariosRouter = require('./routes/comentarios');
const gruposRouter = require('./routes/grupos');
const amizadeRouter = require('./routes/amizade');
const eventosRouter = require('./routes/eventos');
const notificacoesRouter = require('./routes/notificacoes');
const mensagensDiretasRouter = require('./routes/mensagensDiretas');
const adminRouter = require('./routes/admin');
const documentosVerificacaoRouter = require('./routes/documentosVerificacao');
const curtidasRouter = require('./routes/curtidas');
const compartilhamentosRouter = require('./routes/compartilhamentos');
const participanteEventoRouter = require('./routes/participanteEvento');
const membroGrupoRouter = require('./routes/membroGrupo');
const filtrosUsuarioRouter = require('./routes/filtrosUsuario');
const authRouter = require('./routes/auth');
const cadastroRouter = require('./routes/cadastro');
const loginRouter = require('./routes/login');

const app = express();

// Configuração da view engine Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middlewares globais
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'sua_chave_secreta',
  resave: false,
  saveUninitialized: false
}));
// Rotas principais
app.use('/', indexRouter);
app.use('/usuarios', usuariosRouter);
app.use('/categorias', categoriasRouter);
app.use('/tags', tagsRouter);
app.use('/postagens', postagensRouter);
app.use('/comentarios', comentariosRouter);
app.use('/grupos', gruposRouter);
app.use('/amizade', amizadeRouter);
app.use('/eventos', eventosRouter);
app.use('/notificacoes', notificacoesRouter);
app.use('/mensagensDiretas', mensagensDiretasRouter);
app.use('/admin', adminRouter);
app.use('/documentosVerificacao', documentosVerificacaoRouter);
app.use('/curtidas', curtidasRouter);
app.use('/compartilhamentos', compartilhamentosRouter);
app.use('/participanteEvento', participanteEventoRouter);
app.use('/membroGrupo', membroGrupoRouter);
app.use('/filtrosUsuario', filtrosUsuarioRouter);
app.use('/auth', authRouter);
app.use('/cadastro', cadastroRouter);
app.use('/login', loginRouter);
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