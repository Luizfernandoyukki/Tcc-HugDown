const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const requireLogin = require('../middlewares/auth');
const { grupoController } = controllers;

router.get('/', requireLogin, grupoController.listar);
router.post('/', requireLogin, grupoController.criar);

module.exports = router;
