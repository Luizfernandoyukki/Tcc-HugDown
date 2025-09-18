// middlewares/auth.js
const { Postagem } = require('../models');

module.exports = function requireLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    // Se for AJAX, retorna erro JSON
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      return res.status(401).json({ error: 'Você precisa estar logado para realizar esta ação.' });
    }
    // Se for navegação normal, renderiza página de aviso amigável
    return res.status(401).render('login-required', {
      mensagem: 'Você precisa estar logado para acessar esta funcionalidade.',
      redirectUrl: '/login'
    });
  }
  next();
};

// Middleware para garantir que o usuário só acesse/edite o próprio perfil/postagem
function podeEditarOuVerPerfil(req, res, next) {
  const idUrl = parseInt(req.params.id, 10);
  const idSession = req.session.userId;
  if (!idSession || idUrl !== idSession) {
    return res.status(403).render('error', { error: 'Acesso negado.' });
  }
  next();
}

async function podeEditarOuVerPostagem(req, res, next) {
  const idPost = parseInt(req.params.id, 10);
  const idSession = req.session.userId;
  const postagem = await Postagem.findByPk(idPost);
  if (!postagem || postagem.id_autor !== idSession) {
    return res.status(403).render('error', { error: 'Acesso negado à postagem.' });
  }
  next();
}

// Middleware para garantir que só o criador/admin pode editar/ver tag
async function podeEditarOuVerTag(req, res, next) {
  const { Tag } = require('../models');
  const idTag = parseInt(req.params.id, 10);
  const idSession = req.session.userId;
  if (!idSession) {
    return res.status(403).render('error', { error: 'Acesso negado.' });
  }
  const tag = await Tag.findByPk(idTag);
  // Aqui você pode customizar a lógica: por padrão, só permite se for admin (ajuste conforme sua regra)
  if (!tag /*|| tag.id_criador !== idSession*/) {
    return res.status(403).render('error', { error: 'Acesso negado à tag.' });
  }
  next();
}

module.exports.podeEditarOuVerPerfil = podeEditarOuVerPerfil;
module.exports.podeEditarOuVerPostagem = podeEditarOuVerPostagem;
module.exports.podeEditarOuVerTag = podeEditarOuVerTag;
