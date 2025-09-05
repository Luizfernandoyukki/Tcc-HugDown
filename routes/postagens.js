const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const requireLogin = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const { postagemController, categoriaController, tagController, secaoController } = controllers;

// Configuração do multer para upload de postagens
const storagePostagem = multer.diskStorage({
  destination: function (req, file, cb) {
    let tipo = req.body.tipo_postagem;
    if (tipo === 'article') {
      cb(null, path.join(__dirname, '../post/artigos'));
    } else {
      cb(null, path.join(__dirname, '../post/public'));
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nome = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, nome);
  }
});
const uploadPost = multer({ storage: storagePostagem });

// Painel de postagens
router.get('/', requireLogin, async (req, res) => {
  let minhasPostagens = [];
  if (res.locals.usuario) {
    const todasPostagens = await postagemController.listar(req, { raw: true });
    minhasPostagens = todasPostagens.filter(p => p.id_autor === res.locals.usuario.id_usuario);
  }
  res.render('postagens/index', {
    usuario: res.locals.usuario,
    isLoggedIn: res.locals.isLoggedIn,
    temPostagens: minhasPostagens.length > 0
  });
});

// Formulário de criação
router.get('/create', requireLogin, async (req, res) => {
  const categorias = await categoriaController.listar(req, { raw: true });
  const tags = await tagController.listar(req, { raw: true });
  res.render('postagens/create', {
    usuario: res.locals.usuario,
    isLoggedIn: res.locals.isLoggedIn,
    categorias,
    tags
  });
});

// Configuração de postagens
router.get('/config', requireLogin, async (req, res) => {
  const tags = await tagController.listar(req, { raw: true });
  const secoes = await secaoController.listar(req, { raw: true });
  res.render('postagens/config', {
    usuario: res.locals.usuario,
    isLoggedIn: res.locals.isLoggedIn,
    tags,
    secoes
  });
});

// Minhas postagens (show)
router.get('/show', requireLogin, async (req, res) => {
  const postagens = await postagemController.listar(req, { raw: true });
  const minhasPostagens = postagens.filter(p => p.id_autor === res.locals.usuario.id_usuario);
  res.render('postagens/show', {
    usuario: res.locals.usuario,
    isLoggedIn: res.locals.isLoggedIn,
    postagens: minhasPostagens,
    postagensJson: JSON.stringify(minhasPostagens)
  });
});

// Detalhe de uma postagem específica
router.get('/:id', requireLogin, postagemController.buscarPorId);

// ROTA DE EDIÇÃO DE POSTAGEM (renderiza o formulário edit.pug)
router.get('/:id/edit', requireLogin, async (req, res) => {
  const postagem = await postagemController.buscarPorId({ params: { id: req.params.id } }, { raw: true });
  const categorias = await categoriaController.listar(req, { raw: true });
  const tags = await tagController.listar(req, { raw: true });
  if (!postagem) {
    return res.status(404).render('error', { error: 'Postagem não encontrada' });
  }
  res.render('postagens/edit', { post: postagem, categorias, tags, usuario: res.locals.usuario });
});

// Criação, edição, remoção (POST, PUT, DELETE)
router.post('/', requireLogin, uploadPost.single('arquivo_post'), postagemController.criar);
router.put('/:id', requireLogin, postagemController.atualizar);
router.delete('/:id', requireLogin, postagemController.remover);

module.exports = router;
