const express = require('express');
const router = express.Router();

const { postagemController, grupoController, userController } = require('../controllers');

// Página inicial - Feed
router.get('/', async (req, res) => {
  try {
    // Busca posts, sugestões de amigos e grupos populares
    const posts = await postagemController.listar(req, res, true); // true para modo view, se necessário
    const amigos = await userController.sugestoesAmigos ? await userController.sugestoesAmigos(req, res) : [];
    const grupos = await grupoController.populares ? await grupoController.populares(req, res) : [];

    res.render('index', { posts, amigos, grupos });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

module.exports = router;