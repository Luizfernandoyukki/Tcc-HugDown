const express = require('express');
const router = express.Router();

const { curtidaController } = require('../controllers');

// Adicionar curtida a uma postagem
router.post('/postagem/:idPostagem/curtir', async (req, res) => {
  try {
    await curtidaController.criar(req, res);
    res.redirect('back');
  } catch (error) {
    res.status(400).render('error', { error });
  }
});

// Remover curtida de uma postagem
router.post('/postagem/:idPostagem/descurtir', async (req, res) => {
  try {
    await curtidaController.remover(req, res);
    res.redirect('back');
  } catch (error) {
    res.status(400).render('error', { error });
  }
});

// Listar curtidas de uma postagem
router.get('/postagem/:idPostagem', async (req, res) => {
  try {
    const curtidas = await curtidaController.listarPorPostagem(req, res);
    res.render('curtidas/index', { curtidas, idPostagem: req.params.idPostagem });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

module.exports = router;