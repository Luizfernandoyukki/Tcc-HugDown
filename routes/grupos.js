const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index.js');
const { grupoController } = controllers;

// Listar todos os grupos (GET /grupos)
router.get('/', grupoController.listar);

// Buscar grupo por ID (GET /grupos/:id)
router.get('/:id', grupoController.buscarPorId);

// Criar grupo (POST /grupos)
router.post('/', grupoController.criar);

// Atualizar grupo (PUT /grupos/:id)
router.put('/:id', grupoController.atualizar);

// Remover grupo (DELETE /grupos/:id)
router.delete('/:id', grupoController.remover);

module.exports = router;
