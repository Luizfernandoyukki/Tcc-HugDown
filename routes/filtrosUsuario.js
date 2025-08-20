const express = require('express');
const router = express.Router();

const { filtroUsuarioController } = require('../controllers');

// Listar filtros do usuário logado
router.get('/', async (req, res) => {
  try {
    const filtros = await filtroUsuarioController.listar(req, res, true);
    res.render('filtrosUsuario/index', { filtros });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Página de criação de filtro
router.get('/create', (req, res) => {
  res.render('filtrosUsuario/create');
});

// Criar filtro
router.post('/create', async (req, res) => {
  try {
    await filtroUsuarioController.criar(req, res);
    res.redirect('/filtrosUsuario');
  } catch (error) {
    res.status(400).render('filtrosUsuario/create', { error: error.message });
  }
});

// Página de edição de filtro
router.get('/:id/edit', async (req, res) => {
  try {
    const filtro = await filtroUsuarioController.buscarPorId(req, res);
    res.render('filtrosUsuario/edit', { filtro });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});

// Atualizar filtro
router.post('/:id/edit', async (req, res) => {
  try {
    await filtroUsuarioController.atualizar(req, res);
    res.redirect('/filtrosUsuario');
  } catch (error) {
    res.status(400).render('filtrosUsuario/edit', { error: error.message });
  }
});

// Remover filtro
router.post('/:id/delete', async (req, res) => {
  try {
    await filtroUsuarioController.remover(req, res);
    res.redirect('/filtrosUsuario');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

module.exports = router;