const express = require('express');
const router = express.Router();

const { userController } = require('../controllers');

// Página de login
router.get('/login', (req, res) => {
  res.render('usuarios/login');
});

// Realizar login
router.post('/login', async (req, res) => {
  try {
    // Implemente a lógica de autenticação aqui
    // Exemplo: await userController.login(req, res);
    res.redirect('/');
  } catch (error) {
    res.status(401).render('usuarios/login', { error: 'Credenciais inválidas' });
  }
});

// Página de registro
router.get('/register', (req, res) => {
  res.render('usuarios/create');
});

// Realizar registro
router.post('/register', async (req, res) => {
  try {
    await userController.criar(req, res);
    res.redirect('/auth/login');
  } catch (error) {
    res.status(400).render('usuarios/create', { error: error.message });
  }
});

// Logout
router.get('/logout', (req, res) => {
  // req.session.destroy(); // Se estiver usando sessões
  res.redirect('/auth/login');
});

module.exports = router;