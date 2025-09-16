const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const requireLogin = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const { usuarioController } = controllers;
const { podeEditarOuVerPerfil } = require('../middlewares/auth');
const { gerarUrlPerfil, extrairIdPerfil } = require('../utils/camuflaPerfil');

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
router.get('/u-@-_:id', requireLogin, async (req, res) => {
  try {
    const usuario = await usuarioController.buscarPorId({ params: { id: req.params.id } }, {});
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    if (req.session.userId && Number(req.session.userId) === Number(req.params.id)) {
      // Próprio usuário
      return res.render('usuarios/index', { usuario });
    } else {
      // Outro usuário
      return res.render('usuarios/show', { usuario });
    }
  } catch (err) {
    res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});
router.get('/use_retrocv_:id(\\d+)referefe', requireLogin, async (req, res) => {
  try {
    const usuario = await usuarioController.buscarPorId({ params: { id: req.params.id } }, {});
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    if (req.session.userId && Number(req.session.userId) === Number(req.params.id)) {
      return res.render('usuarios/index', { usuario });
    } else {
      return res.render('usuarios/show', { usuario });
    }
  } catch (err) {
    res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});
router.get('/:id/edit', requireLogin, podeEditarOuVerPerfil, async (req, res) => {
  try {
    const usuario = await usuarioController.buscarPorId({ params: { id: req.params.id } }, {});
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    res.render('usuarios/edit', { usuario });
  } catch (err) {
    res.status(500).render('error', { error: 'Erro ao buscar usuário: ' + err.message });
  }
});
router.put('/:id', requireLogin, usuarioController.atualizar);
router.delete('/:id', requireLogin, usuarioController.remover);

// Redireciona rotas antigas para a nova rota camuflada
router.get('/:id', (req, res) => {
  res.redirect(`/use_retrocv_${req.params.id}referefe`);
});
router.get('/:id/edit', (req, res) => {
  res.redirect(`/use_retrocv_${req.params.id}referefe`);
});
router.get('/perfil/:camuflado', requireLogin, async (req, res) => {
  const id = extrairIdPerfil(req.params.camuflado);
  if (!id) return res.status(404).render('error', { error: 'Perfil não encontrado' });
  try {
    const usuario = await usuarioController.buscarPorId({ params: { id } }, {});
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    if (req.session.userId && Number(req.session.userId) === Number(id)) {
      return res.render('usuarios/index', { usuario });
    } else {
      return res.render('usuarios/show', { usuario });
    }
  } catch (err) {
    res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});

module.exports = router;
