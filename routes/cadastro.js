const express = require('express');
const router = express.Router();

const { userController } = require('../controllers');

// Página de cadastro
router.get('/', (req, res) => {
  res.render('usuarios/create');
});

// Realizar cadastro
router.post('/', async (req, res) => {
  try {
    await userController.criar(req, res);
    res.redirect('/auth/login');
  } catch (error) {
    res.status(400).render('usuarios/create', { error: error.message });
  }
});

module.exports = router;