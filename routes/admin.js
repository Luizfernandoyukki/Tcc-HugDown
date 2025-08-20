const express = require('express');
const router = express.Router();

const { 
  administradorController, 
  userController, 
  documentoVerificacaoController 
} = require('../controllers');

// Painel administrativo principal
router.get('/painel', (req, res) => {
  // Exemplo: renderizar painel com estatísticas
  res.render('admin/painel');
});

// Listar todos os usuários
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await userController.listar(req, res, true); // true para modo admin, se quiser customizar
    // Se o controller já envia resposta, remova o render abaixo
    res.render('admin/usuarios', { usuarios });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Listar documentos para verificação
router.get('/documentos-verificacao', async (req, res) => {
  try {
    const documentos = await documentoVerificacaoController.listar(req, res, true);
    res.render('admin/documentosVerificados', { documentos });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Aprovar documento de verificação
router.post('/documentos-verificacao/:id/aprovar', async (req, res) => {
  try {
    await documentoVerificacaoController.aprovar(req, res);
    res.redirect('/admin/documentos-verificacao');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Rejeitar documento de verificação
router.post('/documentos-verificacao/:id/rejeitar', async (req, res) => {
  try {
    await documentoVerificacaoController.rejeitar(req, res);
    res.redirect('/admin/documentos-verificacao');
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Outras rotas administrativas podem ser adicionadas aqui

module.exports = router;