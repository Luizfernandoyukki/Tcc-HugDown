const express = require('express');
const router = express.Router();

const { membroGrupoController } = require('../controllers');

// Listar membros de um grupo
router.get('/grupo/:idGrupo', async (req, res) => {
  try {
    const membros = await membroGrupoController.listar(req, res);
    res.render('grupos/membros', { membros, idGrupo: req.params.idGrupo });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Adicionar membro ao grupo
router.post('/grupo/:idGrupo/adicionar', async (req, res) => {
  try {
    await membroGrupoController.criar(req, res);
    res.redirect(`/grupos/${req.params.idGrupo}`);
  } catch (error) {
    res.status(400).render('error', { error });
  }
});

// Remover membro do grupo
router.post('/:id/remover', async (req, res) => {
  try {
    await membroGrupoController.remover(req, res);
    res.redirect('back');
  } catch (error) {
    res.status(400).render('error', { error });
  }
});

// Atualizar papel do membro
router.post('/:id/atualizar', async (req, res) => {
  try {
    await membroGrupoController.atualizar(req, res);
    res.redirect('back');
  } catch (error) {
    res.status(400).render('error', { error });
  }
});

module.exports = router;