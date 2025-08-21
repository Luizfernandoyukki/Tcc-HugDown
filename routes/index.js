const express = require('express');
const router = express.Router();

const { postagemController, usuarioController, categoriaController, tagController } = require('../controllers');
const grupoController = require('../controllers/grupo');

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

    res.render('index', { posts, amigos, grupos, categorias, tags, usuario });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

module.exports = router;