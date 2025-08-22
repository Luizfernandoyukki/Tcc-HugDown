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