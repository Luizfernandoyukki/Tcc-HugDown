const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index.js');
const requireLogin = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { podeEditarOuVerPostagem } = require('../middlewares/auth');
const {
  postagemController,
  categoriaController,
  tagController,
  secaoController
} = controllers;

// Configuração do multer para upload de postagens
const storagePostagem = multer.diskStorage({
  destination: function (req, file, cb) {
    // Corrija para salvar em public/images/post
    const postDir = path.join(__dirname, '../public/images/post');
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }
    cb(null, postDir);
  },
  filename: function (req, file, cb) {
    // Garante extensão correta
    const ext = path.extname(file.originalname);
    const nome = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, nome);
  }
});

// Novo filtro para aceitar tipos corretos conforme tipo_postagem
const uploadPostagem = multer({ 
  storage: storagePostagem,
  fileFilter: function (req, file, cb) {
    // Se não houver tipo_postagem, aceita tudo (fallback)
    const tipo = req.body.tipo_postagem;
    if (!tipo) return cb(null, true);

    // Mapas de tipos permitidos
    const imageMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const videoMimes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-matroska'];

    if (tipo === 'photo') {
      if (imageMimes.includes(file.mimetype)) return cb(null, true);
      return cb(new Error('Apenas imagens são permitidas para postagens do tipo foto.'));
    }
    if (tipo === 'video') {
      if (videoMimes.includes(file.mimetype)) return cb(null, true);
      return cb(new Error('Apenas vídeos são permitidos para postagens do tipo vídeo.'));
    }
    // Para outros tipos (text, article), não exige arquivo, mas se vier, aceita qualquer coisa
    return cb(null, true);
  }
});

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
  // Busca ids de postagens que estão em alguma seção
  const PostagemSecao = require('../models').PostagemSecao;
  const postagensSecao = await PostagemSecao.findAll({ attributes: ['id_postagem'] });
  const idsEmSecao = new Set(postagensSecao.map(ps => ps.id_postagem));
  // Filtra: só mostra postagens do usuário que NÃO estão em seção
  const minhasPostagens = postagens.filter(
    p => p.id_autor === res.locals.usuario.id_usuario && !idsEmSecao.has(p.id_postagem)
  );
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
router.post('/', requireLogin, uploadPostagem.single('arquivo_post'), async (req, res, next) => {
  try {
    // Verifica se já existe postagem igual
    const { titulo } = req.body;
    const id_autor = res.locals.usuario?.id_usuario;
    if (titulo && id_autor) {
      const existe = await controllers.postagemController.buscarPorTituloAutor(titulo, id_autor);
      if (existe) {
        // Use caminho relativo
        return res.redirect('/postagens');
      }
    }
    // Se não existe, cria normalmente
    await controllers.postagemController.criar(req, res, next);
  } catch (err) {
    next(err);
  }
});
router.put('/:id', requireLogin, postagemController.atualizar);
router.delete('/:id', requireLogin, postagemController.remover);

// Middleware de erro para garantir resposta JSON em caso de erro
router.use((err, req, res, next) => {
  console.error('Erro não tratado em /postagens:', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

module.exports = router;