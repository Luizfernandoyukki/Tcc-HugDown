const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index.js');
const { comentarioController } = controllers;

// Listar todos os comentários (GET /comentarios)
if (comentarioController && comentarioController.listar)
  router.get('/', comentarioController.listar);

// Buscar comentário por ID (GET /comentarios/:id)
if (comentarioController && comentarioController.buscarPorId)
  router.get('/:id', comentarioController.buscarPorId);

// Criar comentário (POST /comentarios)
if (comentarioController && comentarioController.criar)
  router.post('/', comentarioController.criar);

// Atualizar comentário (PUT /comentarios/:id)
if (comentarioController && comentarioController.atualizar)
  router.put('/:id', comentarioController.atualizar);

// Remover comentário (DELETE /comentarios/:id)
if (comentarioController && comentarioController.remover)
  router.delete('/:id', comentarioController.remover);

module.exports = router;