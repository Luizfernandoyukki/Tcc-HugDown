const express = require('express');
const router = express.Router();

const { grupoController, membroGrupoController } = require('../controllers');

// Listar grupos
router.get('/', async (req, res) => {
  try {
    const grupos = await grupoController.listar(req, res, true);
    res.render('grupos/index', { grupos });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Página de criação de grupo
router.get('/create', (req, res) => {
  res.render('grupos/create');
});

// Criar grupo
router.post('/create', async (req, res) => {
  try {
    await grupoController.criar(req, res);
    res.redirect('/grupos');
  } catch (error) {
    res.status(400).render('grupos/create', { error: error.message });
  }
});

// Página de edição de grupo
router.get('/:id/edit', async (req, res) => {
  try {
    const grupo = await grupoController.buscarPorId(req, res);
    res.render('grupos/edit', { grupo });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});

// Atualizar grupo
router.post('/:id/edit', async (req, res) => {
  try {
    await grupoController.atualizar(req, res);
    res.redirect('/grupos');
  } catch (error) {
    res.status(400).render('grupos/edit', { error: error.message });
  }
});

// Visualizar grupo
router.get('/:id', async (req, res) => {
  try {
    const grupo = await grupoController.buscarPorId(req, res);
    res.render('grupos/show', { grupo });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});

// Remover grupo
router.post('/:id/delete', async (req, res) => {
  try {
    await grupoController.remover(req, res);
    res.redirect('/grupos');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Entrar em grupo
router.post('/:id/entrar', async (req, res) => {
  try {
    await membroGrupoController.criar(req, res);
    res.redirect(`/grupos/${req.params.id}`);
  } catch (error) {
    res.status(400).render('error', { error });
  }
});

// Sair do grupo
router.post('/:id/sair', async (req, res) => {
  try {
    await membroGrupoController.remover(req, res);
    res.redirect('/grupos');
  } catch (error) {
    res.status(400).render('error', { error });
  }
});

module.exports = router;