const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const requireLogin = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const { usuarioController } = controllers;
const { podeEditarOuVerPerfil } = require('../middlewares/auth');

// Configuração do multer para cadastro de usuário
const storageCadastro = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'foto_perfil') {
      cb(null, path.join(__dirname, '../perfis'));
    } else if (file.fieldname === 'documento_comprobatorio') {
      cb(null, path.join(__dirname, '../docs'));
    } else {
      cb(new Error('Campo de arquivo não permitido.'));
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nome = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, nome);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'foto_perfil') {
    if (/^image\/(jpeg|png|gif|bmp|webp)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('A foto de perfil deve ser uma imagem.'));
    }
  } else if (file.fieldname === 'documento_comprobatorio') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('O documento comprobatório deve ser um PDF.'));
    }
  } else {
    cb(new Error('Campo de arquivo não permitido.'));
  }
};
const uploadCadastro = multer({ storage: storageCadastro, fileFilter: fileFilter });

router.post(
  '/',
  uploadCadastro.fields([
    { name: 'documento_comprobatorio', maxCount: 1 },
    { name: 'foto_perfil', maxCount: 1 }
  ]),
  usuarioController.criar
);
router.post('/login', usuarioController.login);

router.get('/', requireLogin, usuarioController.listar);
router.get('/:id', podeEditarOuVerPerfil, usuarioController.buscarPorId);
router.get('/:id/edit', podeEditarOuVerPerfil, async (req, res) => {
  // ...código para editar perfil...
});
router.put('/:id', requireLogin, usuarioController.atualizar);
router.delete('/:id', requireLogin, usuarioController.remover);

module.exports = router;
