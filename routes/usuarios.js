const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const requireLogin = require('../middlewares/auth');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const { Usuario, DocumentoVerificacao } = require('../models');
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
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(new Error('O documento comprobatório deve ser PDF, PNG ou JPG.'));
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
    // Adicione usuarioLogado ao render
    const usuarioLogado = await usuarioController.buscarPerfilCompleto(req.session.userId);
    return res.render('usuarios/show', { usuario, usuarioLogado, isLoggedIn: true });
  } catch (err) {
    console.error('[ROUTE][ERROR] Erro ao buscar perfil:', err);
    res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});

// Editar perfil padrão
router.get('/edit/:id', requireLogin, podeEditarOuVerPerfil, async (req, res) => {
  try {
    const { Usuario } = require('../models');
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    // Renderiza a view de edição com o objeto Sequelize (compatível com edit.pug)
    res.render('usuarios/edit', { usuario });
  } catch (err) {
    console.error('[ROUTE][USUARIOS][EDIT] Erro:', err);
    res.status(500).render('error', { error: 'Erro ao buscar usuário: ' + err.message });
  }
});

// Atualizar usuário (agora aceita upload de foto_perfil)
router.put('/:id', requireLogin, uploadCadastro.fields([{ name: 'foto_perfil', maxCount: 1 }]), usuarioController.atualizar);

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

// Página de configurações
router.get('/configuracoes', async (req, res) => {
  res.render('usuarios/configuracoes');
});

// Solicitar exclusão de conta (envia token por e-mail)
router.post('/excluir-conta', async (req, res) => {
  const usuario = await Usuario.findByPk(req.session.userId);
  if (!usuario) return res.render('usuarios/configuracoes', { errorExcluir: 'Usuário não encontrado.' });
  const token = crypto.randomBytes(4).toString('hex').slice(0, 6).toUpperCase();
  req.session.excluirToken = token;
  req.session.excluirTokenExpires = Date.now() + 15 * 60 * 1000;
  req.session.excluirUserId = usuario.id_usuario;

  // Envia e-mail
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
router.post('/excluir-conta/confirmar', async (req, res) => {
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
    // Mensagem de despedida
    res.render('usuarios/configuracoes', { msgDespedida: true });
  });
});

// Solicitar profissional de saúde (envio de documento)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'docs'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});
const upload = multer({ storage, fileFilter: (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Apenas arquivos PDF são aceitos.'));
}});

router.post('/solicitar-profissional', upload.single('documento'), async (req, res) => {
  try {
    const id_usuario = req.session.userId;
    if (!id_usuario) return res.render('usuarios/configuracoes', { errorProfissional: 'Usuário não autenticado.' });
    const { tipo_documento, numero_documento, instituicao, observacoes } = req.body;
    if (!req.file) return res.render('usuarios/configuracoes', { errorProfissional: 'Arquivo PDF obrigatório.' });
    const caminho_arquivo = '/docs/' + req.file.filename;
    await DocumentoVerificacao.create({
      id_usuario,
      tipo_documento,
      numero_documento,
      instituicao,
      caminho_arquivo,
      status: 'pending',
      observacoes
    });
    res.render('usuarios/configuracoes', { infoProfissional: 'Solicitação enviada! Aguarde análise.' });
  } catch (err) {
    res.render('usuarios/configuracoes', { errorProfissional: 'Erro ao enviar solicitação: ' + err.message });
  }
});

module.exports = router;
