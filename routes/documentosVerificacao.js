const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { DocumentoVerificacao } = require('../models');
const requireLogin = require('../middlewares/auth');

// storage para documentos (agora em /public/docs)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'docs'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});
const fileFilter = (req, file, cb) => {
  // aceita apenas PDF (ajuste se quiser imagens)
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Apenas arquivos PDF são aceitos.'));
};
const upload = multer({ storage, fileFilter });

// Criar documento de verificação (usuário envia)
router.post('/', requireLogin, upload.single('documento_comprobatorio'), async (req, res) => {
  try {
    const id_usuario = req.session.userId;
    if (!id_usuario) return res.status(401).render('error', { error: 'Usuário não autenticado.' });

    // validação mínima
    const { tipo_documento, numero_documento, instituicao, observacoes } = req.body;
    if (!req.file) {
      return res.status(400).render('error', { error: 'Arquivo do documento é obrigatório (PDF).' });
    }

    const caminho_arquivo = '/docs/' + req.file.filename;
    const novo = await DocumentoVerificacao.create({
      id_usuario,
      tipo_documento: tipo_documento || null,
      numero_documento: numero_documento || null,
      instituicao: instituicao || null,
      caminho_arquivo,
      status: 'pending',
      observacoes: observacoes || null
    });

    // redireciona para perfil do usuário (ou mostra mensagem)
    return res.redirect('/usuarios/me');
  } catch (err) {
    console.error('[ROTA][documentosVerificacao][POST /] ERRO', err);
    return res.status(500).render('error', { error: 'Erro ao enviar documento: ' + err.message });
  }
});

module.exports = router;