const express = require('express');
const router = express.Router();

const { postagemController, grupoController, usuarioController } = require('../controllers');

// Página inicial - Feed
router.get('/', async (req, res) => {
  try {
    // Busca posts
    const posts = await postagemController.listar();

    // Sugestões de amigos (se usuário logado)
    let amigos = [];
    if (req.session && req.session.userId) {
      amigos = await usuarioController.sugestoesAmigos(req.session.userId);
    }

    // Grupos populares (exemplo: ajuste conforme seu controller)
    let grupos = [];
    if (grupoController.populares) {
      grupos = await grupoController.populares();
    }

    res.render('index', { posts, amigos, grupos });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

module.exports = router;