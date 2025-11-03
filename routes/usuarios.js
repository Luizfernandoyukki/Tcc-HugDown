const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const requireLogin = require('../middlewares/auth');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Storage para imagem de perfil
const storagePerfil = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../public/images/perfis');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});
const uploadPerfil = multer({ storage: storagePerfil });

// Storage para documento de verificação
const storageDoc = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../public/images/docs');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});
const uploadDoc = multer({ storage: storageDoc });

const { Usuario, DocumentoVerificacao } = require('../models');
const { usuarioController } = controllers;
const { podeEditarOuVerPerfil } = require('../middlewares/auth');

router.use(express.urlencoded({ extended: true }));

// Cadastro de usuário (com upload de foto de perfil E documento de verificação)
router.post(
  '/',
  multer({
    storage: storagePerfil,
    // Aceita ambos campos: foto_perfil (imagem) e documento_comprobatorio (pdf)
    fileFilter: (req, file, cb) => {
      if (file.fieldname === 'foto_perfil') {
        // Aceita qualquer imagem
        if (file.mimetype.startsWith('image/')) return cb(null, true);
        return cb(null, false);
      }
      if (file.fieldname === 'documento_comprobatorio') {
        // Aceita apenas PDF
        if (file.mimetype === 'application/pdf') return cb(null, true);
        return cb(null, false);
      }
      cb(null, false);
    }
  }).fields([
    { name: 'foto_perfil', maxCount: 1 },
    { name: 'documento_comprobatorio', maxCount: 1 }
  ]),
  async (req, res, next) => {
    // Ajusta req.file e req.body para o controller
    if (req.files && req.files['foto_perfil']) {
      req.file = req.files['foto_perfil'][0];
    }
    if (req.files && req.files['documento_comprobatorio']) {
      req.body.documento_comprobatorio = req.files['documento_comprobatorio'][0].filename;
    }
    // Chama o controller normalmente
    controllers.usuarioController.criar(req, res, next);
  }
);

// Login
router.post('/login', usuarioController.login);

// Listar usuários
router.get('/', requireLogin, usuarioController.listar);

// Exibir o próprio perfil
router.get('/index/:id', requireLogin, async (req, res) => {
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

// Redirecionar usuário logado para seu próprio perfil
router.get('/me', requireLogin, async (req, res) => {
  const id = req.session.userId;
  if (!id) return res.status(401).render('error', { error: 'Usuário não autenticado.' });
  return res.redirect(`/usuarios/index/${id}`);
});

// Exibir perfil de qualquer usuário
router.get('/show/:id', requireLogin, async (req, res) => {
  try {
    const usuario = await usuarioController.buscarPerfilCompleto(req.params.id);
    if (!usuario) {
      return res.status(404).render('error', { error: 'Usuário não encontrado' });
    }
    const usuarioLogado = await usuarioController.buscarPerfilCompleto(req.session.userId);
    return res.render('usuarios/show', { usuario, usuarioLogado, isLoggedIn: true });
  } catch (err) {
    res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});

// Editar perfil (GET)
router.get('/edit/:id', requireLogin, podeEditarOuVerPerfil, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    res.render('usuarios/edit', { usuario });
  } catch (err) {
    res.status(500).render('error', { error: 'Erro ao buscar usuário: ' + err.message });
  }
});

// Atualizar usuário (com upload de foto de perfil)
router.put('/:id', requireLogin, uploadPerfil.single('foto_perfil'), async (req, res) => {
  try {
    // LOG dos dados recebidos (igual ao cadastro)
    console.log('[EDIT][BACKEND][REQ.BODY]', req.body);
    if (req.file) {
      console.log('[EDIT][BACKEND][REQ.FILE]', req.file);
    }

    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Se veio nova foto, apaga a antiga
    if (req.file) {
      if (usuario.foto_perfil && !usuario.foto_perfil.includes('default')) {
        const fotoPath = path.join(__dirname, '../public', usuario.foto_perfil.replace(/^\/+/, ''));
        if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
      }
      usuario.foto_perfil = '/images/perfis/' + req.file.filename;
    }

    usuario.nome_usuario = req.body.nome_usuario || usuario.nome_usuario;
    usuario.email = req.body.email || usuario.email;
    usuario.biografia = req.body.biografia || usuario.biografia;

    await usuario.save();
    // Retorna sucesso explícito para o frontend
    res.json({ success: true, usuario });
  } catch (err) {
    console.error('[USUARIOS][PUT/:id][ERRO]', err);
    res.status(500).json({ error: 'Erro ao atualizar usuário: ' + err.message });
  }
});

// Remover usuário
router.delete('/:id', requireLogin, usuarioController.remover);

// Redirecionar para perfil pelo id
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
router.get('/find/:id', requireLogin, redirecionarParaPerfil);

// Página de configurações
router.get('/configuracoes', requireLogin, (req, res) => {
  res.render('usuarios/configuracoes');
});

// Solicitar exclusão de conta (envia token por e-mail)
router.post('/excluir-conta', requireLogin, async (req, res) => {
  const usuario = await Usuario.findByPk(req.session.userId);
  if (!usuario) return res.render('usuarios/configuracoes', { errorExcluir: 'Usuário não encontrado.' });
  const token = crypto.randomBytes(4).toString('hex').slice(0, 6).toUpperCase();
  req.session.excluirToken = token;
  req.session.excluirTokenExpires = Date.now() + 15 * 60 * 1000;
  req.session.excluirUserId = usuario.id_usuario;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"HugDown" <no-reply@seudominio.com>',
    to: usuario.email,
    subject: 'Exclusão de conta - HugDown',
    text: `Seu código para excluir a conta é: ${token}`
  });

  res.render('usuarios/configuracoes', { tokenSolicitado: true, infoExcluir: 'Código enviado para seu e-mail.' });
});

// Confirmar exclusão de conta
router.post('/excluir-conta/confirmar', requireLogin, async (req, res) => {
  const { token } = req.body;
  if (
    !req.session.excluirToken ||
    !req.session.excluirUserId ||
    !req.session.excluirTokenExpires ||
    req.session.excluirToken !== token.toUpperCase() ||
    Date.now() > req.session.excluirTokenExpires
  ) {
    return res.render('usuarios/configuracoes', { errorExcluir: 'Código inválido ou expirado.' });
  }
  await Usuario.destroy({ where: { id_usuario: req.session.excluirUserId } });
  req.session.destroy(() => {
    res.render('usuarios/configuracoes', { msgDespedida: true });
  });
});

// Editar perfil (POST, com upload de foto de perfil)
router.post('/edit/:id', requireLogin, podeEditarOuVerPerfil, uploadPerfil.single('foto_perfil'), async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    usuario.email = req.body.email;
    usuario.nome_usuario = req.body.nome_usuario;
    usuario.biografia = req.body.biografia;
    if (req.file) {
      if (usuario.foto_perfil && !usuario.foto_perfil.includes('default')) {
        const fotoPath = path.join(__dirname, '../public', usuario.foto_perfil.replace(/^\/+/, ''));
        if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
      }
      usuario.foto_perfil = '/images/perfis/' + req.file.filename;
    }
    await usuario.save();
    res.redirect(`/usuarios/index/${usuario.id_usuario}`);
  } catch (err) {
    res.status(500).render('error', { error: 'Erro ao atualizar usuário: ' + err.message });
  }
});

// Solicitar profissional de saúde (envio de documento PDF)
router.post('/solicitar-profissional', requireLogin, uploadDoc.single('documento'), async (req, res) => {
  try {
    const id_usuario = req.session.userId;
    if (!id_usuario) return res.render('usuarios/configuracoes', { errorProfissional: 'Usuário não autenticado.' });
    const { tipo_documento, numero_documento, instituicao, observacoes } = req.body;
    if (!req.file) return res.render('usuarios/configuracoes', { errorProfissional: 'Arquivo PDF obrigatório.' });
    await DocumentoVerificacao.create({
      id_usuario,
      tipo_documento,
      numero_documento,
      instituicao,
      caminho_arquivo: '/images/docs/' + req.file.filename,
      status: 'pending',
      observacoes
    });
    res.render('usuarios/configuracoes', { infoProfissional: 'Solicitação enviada! Aguarde análise.' });
  } catch (err) {
    res.render('usuarios/configuracoes', { errorProfissional: 'Erro ao enviar solicitação: ' + err.message });
  }
});

module.exports = router;
