const express = require('express');
const router = express.Router();

const { postagemController, usuarioController, categoriaController, tagController } = require('../controllers');
const grupoController = require('../controllers/grupo');
const controllers = require('../controllers');
const comentarioController = controllers.comentarioController;
const requireLogin = require('../middlewares/auth');

// Página inicial - Feed
router.get('/', async (req, res) => {
  try {
    // Busca posts
    const posts = await postagemController.listar();

    // Busca categorias
    const categorias = await categoriaController.listar();

    // Busca tags
    const tags = await tagController.listar();

    // Sugestões de amigos (se usuário logado)
    let amigos = [];
    if (req.session && req.session.userId) {
      amigos = await usuarioController.sugestoesAmigos(req.session.userId);
    }

    // Grupos populares (exemplo: ajuste conforme seu controller)
    let grupos = [];
    if (grupoController.populares) {
      grupos = await grupoController.populares();
    } else {
      grupos = await grupoController.listar();
    }

    // Usuário logado (se houver)
    let usuario = null;
    if (req.session && req.session.userId) {
      usuario = await usuarioController.buscarPorId(req.session.userId);
    }

    res.render('index', { posts, amigos, grupos, categorias, tags, usuario, usuarioLogado: !!usuario });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Filtro por categoria
router.get('/categoria/:nome', async (req, res) => {
  try {
    const nome = req.params.nome;
    const categoria = await categoriaController.buscarPorNome(nome);
    if (!categoria) return res.status(404).render('error', { error: 'Categoria não encontrada' });

    const posts = await postagemController.listarPorCategoria(categoria.id_categoria);
    const categorias = await categoriaController.listar();
    const tags = await tagController.listar();
    let usuario = null;
    if (req.session && req.session.userId) {
      usuario = await usuarioController.buscarPorId(req.session.userId);
    }
    let grupos = [];
    if (grupoController.populares) {
      grupos = await grupoController.populares();
    } else {
      grupos = await grupoController.listar();
    }
    res.render('index', { posts, categorias, tags, usuario, grupos, categoriaSelecionada: categoria });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Filtro por tag
router.get('/tag/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const tag = await tagController.buscarPorSlug(slug);
    if (!tag) return res.status(404).render('error', { error: 'Tag não encontrada' });

    const posts = await postagemController.listarPorTag(tag.id_tag);
    const categorias = await categoriaController.listar();
    const tags = await tagController.listar();
    let usuario = null;
    if (req.session && req.session.userId) {
      usuario = await usuarioController.buscarPorId(req.session.userId);
    }
    let grupos = [];
    if (grupoController.populares) {
      grupos = await grupoController.populares();
    } else {
      grupos = await grupoController.listar();
    }
    res.render('index', { posts, categorias, tags, usuario, grupos, tagSelecionada: tag });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Exemplo de uso
router.post('/criar', requireLogin, postagemController.criar);
router.post('/comentar', requireLogin, comentarioController.criar);
// Adicione requireLogin em todas rotas de ação (curtir, compartilhar, etc)

module.exports = router;