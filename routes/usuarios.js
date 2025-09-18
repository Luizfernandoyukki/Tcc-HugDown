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

// Função utilitária para extrair o ID do usuário da URL camuflada
function extrairIdCamuflado(str) {
  // Extrai o último grupo de dígitos da string
  const match = str.match(/(\d+)$/);
  return match ? match[1] : null;
}

// ROTAS CAMUFLADAS PADRÃO
router.get('/perfil-:rand_:id', requireLogin, async (req, res) => {
  const id = extrairIdCamuflado(req.params.id);
  console.log('[ROUTE] /perfil-:rand_:id | Renderizando usuarios/index.pug | id extraído:', id);
  if (Number(req.session.userId) !== Number(id)) {
    return res.status(403).render('error', { error: 'Acesso negado ao perfil.' });
  }
  try {
    const usuario = await usuarioController.buscarPerfilCompleto(id);
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    return res.render('usuarios/index', { usuario });
  } catch (err) {
    return res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});

router.get('/u-@-:rand_:id', requireLogin, async (req, res) => {
  const id = extrairIdCamuflado(req.params.id);
  console.log('[ROUTE] /u-@-:rand_:id | Renderizando usuarios/show.pug | id extraído:', id);
  if (Number(req.session.userId) === Number(id)) {
    return res.redirect(usuarioController.gerarUrlPerfilProprio(req.session.userId));
  }
  try {
    const usuario = await usuarioController.buscarPerfilCompleto(id);
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    return res.render('usuarios/show', { usuario });
  } catch (err) {
    return res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});

router.get('/perfil-:rand_:id/edit', requireLogin, podeEditarOuVerPerfil, async (req, res) => {
  const id = extrairIdCamuflado(req.params.id);
  try {
    const usuario = await usuarioController.buscarPerfilCompleto(id);
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    return res.render('usuarios/edit', { usuario });
  } catch (err) {
    return res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});
router.use('/perfis', express.static(path.join(__dirname, '../perfis')));
router.use('/post', express.static(path.join(__dirname, '../post')));

// ROTAS CAMUFLADAS DEVEM VIR ANTES DAS GENÉRICAS
router.get('/perfil-:rand_:id', requireLogin, async (req, res) => {
  const id = extrairIdCamuflado(req.params.id);
  console.log('[ROUTE] /perfil-:rand_:id | Renderizando usuarios/index.pug | id extraído:', id);
  if (Number(req.session.userId) !== Number(id)) {
    console.log('[ERROR] Tentativa de acesso ao perfil de outro usuário via rota própria');
    return res.status(403).render('error', { error: 'Acesso negado ao perfil.' });
  }
  try {
    const usuario = await usuarioController.buscarPerfilCompleto(id);
    console.log('[DB] Dados do usuário (próprio):', usuario);
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    console.log('[VIEW] Renderizando usuarios/index.pug');
    return res.render('usuarios/index', { usuario });
  } catch (err) {
    console.error('[ERROR] Erro ao buscar perfil próprio:', err);
    return res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});

router.get('/u-@-_:rand_:id', requireLogin, async (req, res) => {
  const id = extrairIdCamuflado(req.params.id);
  console.log('[ROUTE] /u-@-_:rand_:id | Renderizando usuarios/show.pug | id extraído:', id);
  if (Number(req.session.userId) === Number(id)) {
    console.log('[REDIRECT] Tentativa de acessar próprio perfil via rota de outro. Redirecionando...');
    return res.redirect(usuarioController.gerarUrlPerfilProprio(req.session.userId));
  }
  try {
    const usuario = await usuarioController.buscarPerfilCompleto(id);
    console.log('[DB] Dados do usuário (outro):', usuario);
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    console.log('[VIEW] Renderizando usuarios/show.pug');
    return res.render('usuarios/show', { usuario });
  } catch (err) {
    console.error('[ERROR] Erro ao buscar perfil de outro usuário:', err);
    return res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});

router.get('/perfil-:rand_:id/edit', requireLogin, podeEditarOuVerPerfil, async (req, res) => {
  const id = extrairIdCamuflado(req.params.id);
  console.log('[ROUTE] /perfil-:rand_:id/edit | session.userId:', req.session.userId, '| id extraído:', id);
  try {
    const usuario = await usuarioController.buscarPerfilCompleto(id);
    console.log('[DB] Dados do usuário para edição:', usuario);
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    console.log('[VIEW] Renderizando usuarios/edit.pug');
    return res.render('usuarios/edit', { usuario });
  } catch (err) {
    console.error('[ERROR] Erro ao buscar perfil para edição:', err);
    return res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});

module.exports = router;
router.get('/:id', (req, res) => {
  // Evita redirecionar se já está em uma URL camuflada
  if (/^perfil-\d+_\d+$/.test(req.params.id) || /^u-@-\d+_\d+$/.test(req.params.id)) {
    return res.status(404).render('error', { error: 'Página não encontrada.' });
  }
  // Se for o próprio usuário, redireciona para perfil camuflado
  if (req.session && req.session.userId && Number(req.session.userId) === Number(req.params.id)) {
    const url = require('../controllers/usuario').gerarUrlPerfilProprio(req.session.userId);
    return res.redirect(url);
  }
  // Se for outro usuário, redireciona para perfil camuflado de outro
  const url = require('../controllers/usuario').gerarUrlPerfilOutro(req.params.id);
  return res.redirect(url);
});

router.get('/:id/edit', (req, res) => {
  // Redireciona para rota de edição camuflada do próprio perfil
  if (req.session && req.session.userId && Number(req.session.userId) === Number(req.params.id)) {
    const rand = Math.floor(Math.random() * 900000 + 100000);
    return res.redirect(`/usuarios/perfil-${rand}_${req.session.userId}/edit`);
  }
  // Não permite editar perfil de outro usuário
  return res.status(403).render('error', { error: 'Acesso negado.' });
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
router.get('/chogue/:id', async (req, res) => {
  try {
    // Busca usuário, postagens e amigos
    const usuario = await usuarioController.buscarPerfilCompleto(req.params.id);
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    // Renderiza a tela de perfil audiovisualista (show)
    return res.render('usuarios/show', { usuario });
  } catch (err) {
    res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});
router.get('/chogue_u-@-_:id', async (req, res) => {
  try {
    const usuario = await usuarioController.buscarPerfilCompleto(req.params.id);
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    // Renderiza a view correta dentro da pasta usuarios
    return res.render('usuarios/show', { usuario });
  } catch (err) {
    res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});

// Servir imagens de perfil e post como estático
router.use('/perfis', express.static(path.join(__dirname, '../perfis')));
router.use('/post', express.static(path.join(__dirname, '../post')));

// ROTAS CAMUFLADAS DEVEM VIR ANTES DAS GENÉRICAS
router.get('/perfil-:rand_:id', requireLogin, async (req, res) => {
  const id = extrairIdCamuflado(req.params.id);
  console.log('[ROUTE] /perfil-:rand_:id | Renderizando usuarios/index.pug | id extraído:', id);
  if (Number(req.session.userId) !== Number(id)) {
    console.log('[ERROR] Tentativa de acesso ao perfil de outro usuário via rota própria');
    return res.status(403).render('error', { error: 'Acesso negado ao perfil.' });
  }
  try {
    const usuario = await usuarioController.buscarPerfilCompleto(id);
    console.log('[DB] Dados do usuário (próprio):', usuario);
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    console.log('[VIEW] Renderizando usuarios/index.pug');
    return res.render('usuarios/index', { usuario });
  } catch (err) {
    console.error('[ERROR] Erro ao buscar perfil próprio:', err);
    return res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});

router.get('/u-@-_:rand_:id', requireLogin, async (req, res) => {
  const id = extrairIdCamuflado(req.params.id);
  console.log('[ROUTE] /u-@-_:rand_:id | Renderizando usuarios/show.pug | id extraído:', id);
  if (Number(req.session.userId) === Number(id)) {
    console.log('[REDIRECT] Tentativa de acessar próprio perfil via rota de outro. Redirecionando...');
    return res.redirect(usuarioController.gerarUrlPerfilProprio(req.session.userId));
  }
  try {
    const usuario = await usuarioController.buscarPerfilCompleto(id);
    console.log('[DB] Dados do usuário (outro):', usuario);
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    console.log('[VIEW] Renderizando usuarios/show.pug');
    return res.render('usuarios/show', { usuario });
  } catch (err) {
    console.error('[ERROR] Erro ao buscar perfil de outro usuário:', err);
    return res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});

router.get('/perfil-:rand_:id/edit', requireLogin, podeEditarOuVerPerfil, async (req, res) => {
  const id = extrairIdCamuflado(req.params.id);
  console.log('[ROUTE] /perfil-:rand_:id/edit | session.userId:', req.session.userId, '| id extraído:', id);
  try {
    const usuario = await usuarioController.buscarPerfilCompleto(id);
    console.log('[DB] Dados do usuário para edição:', usuario);
    if (!usuario) return res.status(404).render('error', { error: 'Usuário não encontrado' });
    console.log('[VIEW] Renderizando usuarios/edit.pug');
    return res.render('usuarios/edit', { usuario });
  } catch (err) {
    console.error('[ERROR] Erro ao buscar perfil para edição:', err);
    return res.status(500).render('error', { error: 'Erro ao buscar perfil: ' + err.message });
  }
});

module.exports = router;
