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

// Cadastro de usuário
router.post(
  '/',
  uploadCadastro.fields([
    { name: 'documento_comprobatorio', maxCount: 1 },
    { name: 'foto_perfil', maxCount: 1 }
  ]),
  usuarioController.criar
);

// Login
router.post('/login', usuarioController.login);

// Listar usuários
router.get('/', requireLogin, usuarioController.listar);

// Rota para exibir o próprio perfil (index)
router.get('/index/:id', requireLogin, async (req, res) => {
  // Só permite acessar se for o próprio usuário
  if (Number(req.session.userId) !== Number(req.params.id)) {
    return res.status(403).render('error', { error: 'Acesso negado ao perfil.' });
  }
  try {
    const usuario = await usuarioController.buscarPerfilCompleto(req.params.id);
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    return res.render('usuarios/index', { usuario });
  } catch (err) {
    res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});

// Rota para redirecionar o usuário logado para seu próprio perfil
router.get('/me', requireLogin, async (req, res) => {
  const id = req.session.userId;
  if (!id) return res.status(401).render('error', { error: 'Usuário não autenticado.' });
  return res.redirect(`/usuarios/index/${id}`);
});

// Rota para exibir o perfil de qualquer usuário (show)
router.get('/show/:id', requireLogin, async (req, res) => {
  try {
    const usuario = await usuarioController.buscarPerfilCompleto(req.params.id);
    if (!usuario) {
      console.warn('[ROUTE] Usuário não encontrado:', req.params.id);
      return res.status(404).render('error', { error: 'Usuário não encontrado' });
    }
    return res.render('usuarios/show', { usuario });
  } catch (err) {
    console.error('[ROUTE][ERROR] Erro ao buscar perfil:', err);
    res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});

// Editar perfil padrão
router.get('/edit/:id', requireLogin, podeEditarOuVerPerfil, async (req, res) => {
  try {
    const usuario = await usuarioController.buscarPorId({ params: { id: req.params.id } }, {});
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    res.render('usuarios/edit', { usuario });
  } catch (err) {
    res.status(500).render('error', { error: 'Erro ao buscar usuário: ' + err.message });
  }
});

// Atualizar usuário
router.put('/:id', requireLogin, usuarioController.atualizar);

// Remover usuário
router.delete('/:id', requireLogin, usuarioController.remover);

// Função utilitária para verificar se o usuário existe e redirecionar para o perfil
async function redirecionarParaPerfil(req, res, next) {
  const id = req.params.id;
  try {
    const usuario = await usuarioController.buscarPerfilCompleto(id);
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado.' });
    return res.redirect(`/usuarios/show/${id}`);
  } catch (err) {
    return res.status(500).render('error', { error: 'Erro ao localizar perfil: ' + err.message });
  }
}

// Rota para buscar qualquer usuário pelo id e redirecionar para o perfil correto
router.get('/find/:id', requireLogin, redirecionarParaPerfil);

module.exports = router;
router.use('/perfis', express.static(path.join(__dirname, '../perfis')));
router.use('/post', express.static(path.join(__dirname, '../post')));
module.exports = router;
