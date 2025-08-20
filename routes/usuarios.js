const express = require('express');
const router = express.Router();

const { userController } = require('../controllers');

// Listar usuários
router.get('/', async (req, res) => {
  try {
    const usuarios = await userController.listar(req, res, true);
    res.render('usuarios/index', { usuarios });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Página de cadastro de usuário
router.get('/create', (req, res) => {
  res.render('usuarios/create');
});

// Criar usuário
router.post('/create', async (req, res) => {
  try {
    await userController.criar(req, res);
    res.redirect('/usuarios');
  } catch (error) {
    res.status(400).render('usuarios/create', { error: error.message });
  }
});

// Página de edição de usuário
router.get('/:id/edit', async (req, res) => {
  try {
    const usuario = await userController.buscarPorId(req, res);
    res.render('usuarios/edit', { usuario });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});

// Atualizar usuário
router.post('/:id/edit', async (req, res) => {
  try {
    await userController.atualizar(req, res);
    res.redirect('/usuarios');
  } catch (error) {
    res.status(400).render('usuarios/edit', { error: error.message });
  }
});

// Visualizar perfil do usuário
router.get('/:id', async (req, res) => {
  try {
    const usuario = await userController.buscarPorId(req, res);
    res.render('usuarios/show', { usuario });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});

// Remover usuário
router.post('/:id/delete', async (req, res) => {
  try {
    await userController.remover(req, res);
    res.redirect('/usuarios');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

module.exports = router;