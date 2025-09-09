const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');
const fetch = require('node-fetch');
const controllers = require('../controllers/index.js');
const {
  categoriaController,
  tagController,
  grupoController,
  postagemController, // <--- Adicione isso
} = controllers;
const { usuarioController } = require('../controllers');

// Wrapper para async/await
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware global para usuário logado
router.use(async (req, res, next) => {
  res.locals.isLoggedIn = !!req.session.isLoggedIn;
  if (req.session.userId) {
    res.locals.usuario = await Usuario.findByPk(req.session.userId);
  } else {
    res.locals.usuario = null;
  }
  next();
});

// Página inicial
router.get('/', asyncHandler(async (req, res) => {
  const [posts, categorias, tags, grupos] = await Promise.all([
    postagemController.listar(req, { raw: true }), // <--- Corrija aqui
    categoriaController.listar(req, { raw: true }),
    tagController.listar(req, { raw: true }),
    grupoController.listar(req, { raw: true }),
  ]);
  res.render('index', {
    posts,
    categorias,
    tags,
    grupos,
    usuario: res.locals.usuario,
    isLoggedIn: res.locals.isLoggedIn
  });
}));

// Rotas de autenticação
router.get('/cadastro', (req, res) => res.render('cadastro'));
router.get('/login', (req, res) => res.render('login'));
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});
router.post('/login', usuarioController.login);

// Importação dos módulos de rota (cada um em seu arquivo)
router.use('/usuarios', require('./usuarios'));
router.use('/postagens', require('./postagens'));
router.use('/categorias', require('./categorias'));
router.use('/tags', require('./tags'));
router.use('/grupos', require('./grupos'));
router.use('/administradores', require('./administradores'));
router.use('/amizades', require('./amizades'));
router.use('/comentarios', require('./comentarios'));
router.use('/compartilhamentos', require('./compartilhamentos'));
router.use('/curtidas', require('./curtidas'));
router.use('/documentos-verificacao', require('./documentosVerificacao'));
router.use('/eventos', require('./eventos'));
router.use('/idiomas', require('./idiomas'));
router.use('/membros-grupo', require('./membrosGrupo'));
router.use('/mensagens-diretas', require('./mensagensDiretas'));
router.use('/notificacoes', require('./notificacoes'));
router.use('/participantes-evento', require('./participantesEvento'));
router.use('/secoes', require('./secoes'));
router.use('/secoes-traducao', require('./secoesTraducao'));
router.use('/categorias-traducao', require('./categoriasTraducao'));
router.use('/tags-traducao', require('./tagsTraducao'));

// Função utilitária (se necessário)
async function getLocationFromLatLng(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.address ? `${data.address.city || data.address.town || data.address.village || ''}, ${data.address.state || ''}` : '';
}

module.exports = router;