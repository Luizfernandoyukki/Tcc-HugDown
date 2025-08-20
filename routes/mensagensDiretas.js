const express = require('express');
const router = express.Router();

const { mensagemDiretaController } = require('../controllers');

// Listar conversas/mensagens do usuário logado
router.get('/', async (req, res) => {
  try {
    const mensagens = await mensagemDiretaController.listar(req, res, true);
    res.render('mensagensDiretas/index', { mensagens });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Visualizar uma conversa específica
router.get('/:id', async (req, res) => {
  try {
    const mensagem = await mensagemDiretaController.buscarPorId(req, res);
    res.render('mensagensDiretas/show', { mensagem });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});

// Página de envio de nova mensagem
router.get('/create', (req, res) => {
  res.render('mensagensDiretas/create');
});

// Enviar nova mensagem
router.post('/create', async (req, res) => {
  try {
    await mensagemDiretaController.criar(req, res);
    res.redirect('/mensagensDiretas');
  } catch (error) {
    res.status(400).render('mensagensDiretas/create', { error: error.message });
  }
});

// Editar mensagem (opcional)
router.post('/:id/edit', async (req, res) => {
  try {
    await mensagemDiretaController.atualizar(req, res);
    res.redirect('/mensagensDiretas');
  } catch (error) {
    res.status(400).render('error', { error });
  }
});

// Remover mensagem
router.post('/:id/delete', async (req, res) => {
  try {
    await mensagemDiretaController.remover(req, res);
    res.redirect('/mensagensDiretas');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

module.exports = router;