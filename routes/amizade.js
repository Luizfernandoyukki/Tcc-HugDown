const express = require('express');
const router = express.Router();

const { amizadeController } = require('../controllers');

// Listar amizades do usuário logado
router.get('/', async (req, res) => {
  try {
    const amizades = await amizadeController.listar(req, res, true); // true para modo view, se necessário
    res.render('amizade/index', { amizades });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Listar solicitações de amizade recebidas
router.get('/solicitacoes', async (req, res) => {
  try {
    const solicitacoes = await amizadeController.listarSolicitacoes(req, res);
    res.render('amizade/solicitacoes', { solicitacoes });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Enviar solicitação de amizade
router.post('/enviar', async (req, res) => {
  try {
    await amizadeController.criar(req, res);
    res.redirect('/amizade/solicitacoes');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Aceitar solicitação de amizade
router.post('/:id/aceitar', async (req, res) => {
  try {
    await amizadeController.aceitar(req, res);
    res.redirect('/amizade');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Rejeitar ou remover amizade
router.post('/:id/remover', async (req, res) => {
  try {
    await amizadeController.remover(req, res);
    res.redirect('/amizade');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

module.exports = router;