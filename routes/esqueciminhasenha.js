const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// GET: Formulário para solicitar redefinição
router.get('/', (req, res) => {
  res.render('esqeuciminhasenha');
});

// POST: Solicita redefinição, gera token e envia e-mail
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.render('esqeuciminhasenha', { error: 'Informe seu e-mail.' });

  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) return res.render('esqeuciminhasenha', { error: 'E-mail não encontrado.' });

  // Gera token aleatório de 6 dígitos/letras
  const token = crypto.randomBytes(4).toString('hex').slice(0, 6).toUpperCase();

  // Salva token e validade na sessão (ou banco, se preferir)
  req.session.resetToken = token;
  req.session.resetUserId = usuario.id_usuario;
  req.session.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutos

  // Envia e-mail (ajuste as credenciais do transporter)
  // RECOMENDADO: use variáveis de ambiente para email e senha de app do Google
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER ,// coloque seu e-mail aqui ou use variável de ambiente
      pass: process.env.EMAIL_PASS   // coloque a senha de app aqui ou use variável de ambiente
    }
  });

  await transporter.sendMail({
    from: '"HugDown" <seuemail@gmail.com>',
    to: usuario.email,
    subject: 'Redefinição de senha - HugDown',
    text: `Você solicitou troca de senha por meio de e-mail, caso não tenha sido você ignore este e-mail.
    Seu código de redefinição de senha é: ${token}`
  });

  res.render('esqeuciminhasenha', { info: 'Código enviado para seu e-mail.' });
});

// POST: Verifica token e permite redefinir senha
router.post('/verificar', async (req, res) => {
  const { token, novaSenha } = req.body;
  if (!token) return res.render('esqeuciminhasenha', { error: 'Informe o código recebido.' });

  if (
    !req.session.resetToken ||
    !req.session.resetUserId ||
    !req.session.resetTokenExpires ||
    req.session.resetToken !== token.toUpperCase() ||
    Date.now() > req.session.resetTokenExpires
  ) {
    return res.render('esqeuciminhasenha', { error: 'Código inválido ou expirado.' });
  }

  if (novaSenha) {
    // Atualiza a senha do usuário
    const bcrypt = require('bcrypt');
    const senha_hash = await bcrypt.hash(novaSenha, 10);
    const { Usuario } = require('../models');
    await Usuario.update(
      { senha_hash },
      { where: { id_usuario: req.session.resetUserId } }
    );
    // Limpa sessão
    req.session.resetToken = null;
    req.session.resetUserId = null;
    req.session.resetTokenExpires = null;
    return res.render('esqeuciminhasenha', { info: 'Senha redefinida com sucesso! Faça login.' });
  } else {
    // Usuário optou por não redefinir senha, apenas limpa sessão
    req.session.resetToken = null;
    req.session.resetUserId = null;
    req.session.resetTokenExpires = null;
    return res.render('esqeuciminhasenha', { info: 'Você pode continuar usando sua senha antiga.' });
  }
});

module.exports = router;
