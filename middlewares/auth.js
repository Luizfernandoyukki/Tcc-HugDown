// middlewares/auth.js
const { Postagem } = require('../models');

module.exports = function requireLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    // Se for AJAX, retorna erro JSON
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      return res.status(401).json({ error: 'Você precisa estar logado para realizar esta ação.' });
    }
    // Se for navegação normal, renderiza página de aviso
    return res.status(401).render('error', {
      error: 'Você precisa estar logado para realizar esta ação.'
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

module.exports.podeEditarOuVerPerfil = podeEditarOuVerPerfil;
module.exports.podeEditarOuVerPostagem = podeEditarOuVerPostagem;
