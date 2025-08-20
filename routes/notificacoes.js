const express = require('express');
const router = express.Router();

const { notificacaoController } = require('../controllers');

// Listar notificações do usuário logado
router.get('/', async (req, res) => {
  try {
    const notificacoes = await notificacaoController.listar(req, res, true);
    res.render('notificacoes/index', { notificacoes });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Visualizar notificação específica
router.get('/:id', async (req, res) => {
  try {
    const notificacao = await notificacaoController.buscarPorId(req, res);
    res.render('notificacoes/show', { notificacao });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});

// Marcar notificação como lida
router.post('/:id/ler', async (req, res) => {
  try {
    await notificacaoController.atualizar(req, res);
    res.redirect('/notificacoes');
  } catch (error) {
    res.status(400).render('error', { error });
  }
});

// Remover notificação
router.post('/:id/delete', async (req, res) => {
  try {
    await notificacaoController.remover(req, res);
    res.redirect('/notificacoes');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

module.exports = router;