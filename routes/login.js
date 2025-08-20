const express = require('express');
const router = express.Router();

const { userController } = require('../controllers');

// Página de login
router.get('/', (req, res) => {
  res.render('usuarios/login');
});

// Realizar login
router.post('/', async (req, res) => {
  try {
    // Implemente a lógica de autenticação aqui
    // Exemplo: await userController.login(req, res);
    res.redirect('/');
  } catch (error) {
    res.status(401).render('usuarios/login', { error: 'Credenciais inválidas' });
  }
});

module.exports = router;