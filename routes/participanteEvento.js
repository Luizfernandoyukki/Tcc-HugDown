const express = require('express');
const router = express.Router();

const { participanteEventoController } = require('../controllers');

// Listar participantes de um evento
router.get('/evento/:idEvento', async (req, res) => {
  try {
    const participantes = await participanteEventoController.listar(req, res);
    res.render('eventos/participantes', { participantes, idEvento: req.params.idEvento });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Inscrever usuário em evento
router.post('/evento/:idEvento/inscrever', async (req, res) => {
  try {
    await participanteEventoController.criar(req, res);
    res.redirect(`/eventos/${req.params.idEvento}`);
  } catch (error) {
    res.status(400).render('error', { error });
  }
});

// Atualizar status de participação
router.post('/:id/atualizar', async (req, res) => {
  try {
    await participanteEventoController.atualizar(req, res);
    res.redirect('back');
  } catch (error) {
    res.status(400).render('error', { error });
  }
});

// Remover participante do evento
router.post('/:id/remover', async (req, res) => {
  try {
    await participanteEventoController.remover(req, res);
    res.redirect('back');
  } catch (error) {
    res.status(400).render('error', { error });
  }
});

module.exports = router;