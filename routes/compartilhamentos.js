const express = require('express');
const router = express.Router();

const { compartilhamentoController } = require('../controllers');

// Listar compartilhamentos de uma postagem
router.get('/postagem/:idPostagem', async (req, res) => {
  try {
    const compartilhamentos = await compartilhamentoController.listarPorPostagem(req, res);
    res.render('compartilhamentos/index', { compartilhamentos, idPostagem: req.params.idPostagem });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Página de criação de compartilhamento
router.get('/postagem/:idPostagem/create', (req, res) => {
  res.render('compartilhamentos/create', { idPostagem: req.params.idPostagem });
});

// Criar compartilhamento
router.post('/postagem/:idPostagem/create', async (req, res) => {
  try {
    await compartilhamentoController.criar(req, res);
    res.redirect(`/compartilhamentos/postagem/${req.params.idPostagem}`);
  } catch (error) {
    res.status(400).render('compartilhamentos/create', { error: error.message, idPostagem: req.params.idPostagem });
  }
});

// Remover compartilhamento
router.post('/:id/delete', async (req, res) => {
  try {
    await compartilhamentoController.remover(req, res);
    res.redirect('back');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

module.exports = router;