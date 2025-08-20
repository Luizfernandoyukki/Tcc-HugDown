const express = require('express');
const router = express.Router();

const { documentoVerificacaoController } = require('../controllers');

// Listar documentos de verificação do usuário logado
router.get('/', async (req, res) => {
  try {
    const documentos = await documentoVerificacaoController.listar(req, res, true);
    res.render('admin/documentosVerificados', { documentos });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Página de envio de novo documento
router.get('/create', (req, res) => {
  res.render('admin/documentosVerificados'); // Altere para a view correta se necessário
});

// Enviar novo documento de verificação
router.post('/create', async (req, res) => {
  try {
    await documentoVerificacaoController.criar(req, res);
    res.redirect('/documentosVerificacao');
  } catch (error) {
    res.status(400).render('admin/documentosVerificados', { error: error.message });
  }
});

// Aprovar documento
router.post('/:id/aprovar', async (req, res) => {
  try {
    await documentoVerificacaoController.aprovar(req, res);
    res.redirect('/documentosVerificacao');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Rejeitar documento
router.post('/:id/rejeitar', async (req, res) => {
  try {
    await documentoVerificacaoController.rejeitar(req, res);
    res.redirect('/documentosVerificacao');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

module.exports = router;