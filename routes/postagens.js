const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index.js');
const requireLogin = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // <-- Adicione isso
const { podeEditarOuVerPostagem } = require('../middlewares/auth');
const {
  postagemController,
  categoriaController,
  tagController,
  secaoController
} = controllers;

// Garante que a pasta 'post' existe
const postDir = path.join(__dirname, '../post');
if (!fs.existsSync(postDir)) {
  fs.mkdirSync(postDir, { recursive: true });
}

// Configuração do multer para upload de postagens
const storagePostagem = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('[DEBUG] Salvando arquivo em:', postDir); // <-- Adicione este log
    cb(null, postDir); // usa a variável já garantida
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nome = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, nome);
  }
});
const uploadPostagem = multer({ storage: storagePostagem });

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
router.get('/:id', requireLogin, podeEditarOuVerPostagem, postagemController.buscarPorId);

// ROTA DE EDIÇÃO DE POSTAGEM (renderiza o formulário edit.pug)
router.get('/:id/edit', requireLogin, podeEditarOuVerPostagem, async (req, res) => {
  const postagem = await postagemController.buscarPorId({ params: { id: req.params.id } }, { raw: true });
  const categorias = await categoriaController.listar(req, { raw: true });
  const tags = await tagController.listar(req, { raw: true });
  if (!postagem) {
    return res.status(404).render('error', { error: 'Postagem não encontrada' });
  }
  res.render('postagens/edit', { post: postagem, categorias, tags, usuario: res.locals.usuario });
});

// Criação, edição, remoção (POST, PUT, DELETE)
router.post('/', requireLogin, uploadPostagem.single('arquivo_post'), postagemController.criar);
router.put('/:id', requireLogin, postagemController.atualizar);
router.delete('/:id', requireLogin, postagemController.remover);

// Middleware de erro para garantir resposta JSON em caso de erro
router.use((err, req, res, next) => {
  console.error('Erro não tratado em /postagens:', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

module.exports = router;
