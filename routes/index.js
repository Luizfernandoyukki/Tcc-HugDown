const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const requireLogin = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const { Usuario } = require('../models');
const fetch = require('node-fetch');

const {
  administradorController,
  amizadeController,
  categoriaController,
  categoriaTraducaoController,
  comentarioController,
  compartilhamentoController,
  curtidaController,
  documentoVerificacaoController,
  eventoController,
  grupoController,
  idiomaController,
  membroGrupoController,
  mensagemDiretaController,
  notificacaoController,
  participanteEventoController,
  postagemController,
  secaoController,
  secaoTraducaoController,
  tagController,
  tagTraducaoController,
  usuarioController,
} = controllers;

// Wrapper para async/await
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
const storagePostagem = multer.diskStorage({
  destination: function (req, file, cb) {
    // O tipo de postagem vem do body do formulário
    let tipo = req.body.tipo_postagem;
    if (tipo === 'article') {
      cb(null, path.join(__dirname, '../post/artigos'));
    } else {
      cb(null, path.join(__dirname, '../post/public'));
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nome = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, nome);
  }
});

const uploadPost = multer({ storage: storagePostagem });

router.post(
  '/postagens',
  requireLogin,
  uploadPost.single('arquivo_post'),
  asyncHandler(postagemController.criar)
);
// Exemplo de configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../perfis'));
  },
  filename: function (req, file, cb) {
    // Nome único: id + timestamp + extensão
    const ext = path.extname(file.originalname);
    const nome = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, nome);
  }
});
const upload = multer({ storage });

const storageDoc = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../docs'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nome = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, nome);
  }
});
const uploadDoc = multer({ storage: storageDoc });

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'foto_perfil') {
    // Aceita apenas imagens
    if (/^image\/(jpeg|png|gif|bmp|webp)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('A foto de perfil deve ser uma imagem.'));
    }
  } else if (file.fieldname === 'documento_comprobatorio') {
    // Aceita apenas PDF
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('O documento comprobatório deve ser um PDF.'));
    }
  } else {
    cb(new Error('Campo de arquivo não permitido.'));
  }
};

// ROTAS PÁGINA (renderizam HTML)
router.get('/', asyncHandler(async (req, res) => {
  const [posts, categorias, tags, grupos] = await Promise.all([
    postagemController.listar(req, { raw: true }),
    categoriaController.listar(req, { raw: true }),
    tagController.listar(req, { raw: true }),
    grupoController.listar(req, { raw: true }),
  ]);
  console.log('[DEBUG] Renderizando index. Usuário logado:', res.locals.usuario ? res.locals.usuario.email : null);
  res.render('index', {
    posts,
    categorias,
    tags,
    grupos,
    usuario: res.locals.usuario,
    isLoggedIn: res.locals.isLoggedIn
  });
}));

router.get('/categorias', asyncHandler(async (req, res) => {
  const categorias = await categoriaController.listar(req, { raw: true });
  res.render('categorias/index', { categorias });
}));

router.get('/categorias/:id', asyncHandler(async (req, res) => {
  const categoria = await categoriaController.buscarPorId(req.params.id);
  if (!categoria) return res.status(404).render('error', { error: 'Categoria não encontrada' });
  res.render('categorias/show', { categoria });
}));

router.get('/cadastro', (req, res) => res.render('cadastro'));
router.get('/login', (req, res) => res.render('login'));

// ROTAS DE API (JSON)
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

router.post(
  '/cadastro',
  multer({
    storage: storageCadastro,
    fileFilter: fileFilter
  }).fields([
    { name: 'documento_comprobatorio', maxCount: 1 },
    { name: 'foto_perfil', maxCount: 1 }
  ]),
  asyncHandler(usuarioController.criar)
);
router.post('/login', asyncHandler(usuarioController.login)); // se existir login

// ROTAS PROTEGIDAS (requireLogin)
router.get('/administradores', requireLogin, asyncHandler(administradorController.listar));
router.post('/administradores', requireLogin, asyncHandler(administradorController.criar));

router.get('/amizades', requireLogin, asyncHandler(amizadeController.listar));
router.post('/amizades', requireLogin, asyncHandler(amizadeController.criar));

router.get('/categorias-traducao', requireLogin, asyncHandler(categoriaTraducaoController.listar));

router.get('/comentarios', requireLogin, asyncHandler(comentarioController.listar));
router.post('/comentarios', requireLogin, asyncHandler(comentarioController.criar));

router.get('/compartilhamentos', requireLogin, asyncHandler(compartilhamentoController.listar));
router.post('/compartilhamentos', requireLogin, asyncHandler(compartilhamentoController.criar));

router.get('/curtidas', requireLogin, asyncHandler(curtidaController.listar));
router.post('/curtidas', requireLogin, asyncHandler(curtidaController.criar));

router.get('/documentos-verificacao', requireLogin, asyncHandler(documentoVerificacaoController.listar));
router.post('/documentos-verificacao', requireLogin, asyncHandler(documentoVerificacaoController.criar));

router.get('/eventos', requireLogin, asyncHandler(eventoController.listar));
router.post('/eventos', requireLogin, asyncHandler(eventoController.criar));

router.get('/grupos', requireLogin, asyncHandler(grupoController.listar));
router.post('/grupos', requireLogin, asyncHandler(grupoController.criar));

router.get('/idiomas', requireLogin, asyncHandler(idiomaController.listar));

router.get('/membros-grupo', requireLogin, asyncHandler(membroGrupoController.listar));
router.post('/membros-grupo', requireLogin, asyncHandler(membroGrupoController.criar));

router.get('/mensagens-diretas', requireLogin, asyncHandler(mensagemDiretaController.listar));
router.post('/mensagens-diretas', requireLogin, asyncHandler(mensagemDiretaController.criar));

router.get('/notificacoes', requireLogin, asyncHandler(notificacaoController.listar));
router.post('/notificacoes', requireLogin, asyncHandler(notificacaoController.criar));

router.get('/participantes-evento', requireLogin, asyncHandler(participanteEventoController.listar));
router.post('/participantes-evento', requireLogin, asyncHandler(participanteEventoController.criar));

// Painel de postagens
router.get('/postagens', asyncHandler(async (req, res) => {
  let minhasPostagens = [];
  if (res.locals.usuario) {
    const todasPostagens = await postagemController.listar(req, { raw: true });
    minhasPostagens = todasPostagens.filter(p => p.id_autor === res.locals.usuario.id_usuario);
  }
  res.render('postagens/index', {
    usuario: res.locals.usuario,
    isLoggedIn: res.locals.isLoggedIn,
    temPostagens: minhasPostagens.length > 0
  });
}));

// Formulário de criação
router.get('/postagens/create', requireLogin, asyncHandler(async (req, res) => {
  const categorias = await categoriaController.listar(req, { raw: true });
  const tags = await tagController.listar(req, { raw: true });
  res.render('postagens/create', {
    usuario: res.locals.usuario,
    isLoggedIn: res.locals.isLoggedIn,
    categorias,
    tags
  });
}));

// Configuração de postagens
router.get('/postagens/config', requireLogin, asyncHandler(async (req, res) => {
  const tags = await tagController.listar(req, { raw: true });
  const secoes = await secaoController.listar(req, { raw: true });
  res.render('postagens/config', {
    usuario: res.locals.usuario,
    isLoggedIn: res.locals.isLoggedIn,
    tags,
    secoes
  });
}));

// Minhas postagens (show)
router.get('/postagens/show', requireLogin, asyncHandler(async (req, res) => {
  const postagens = await postagemController.listar(req, { raw: true });
  const minhasPostagens = postagens.filter(p => p.id_autor === res.locals.usuario.id_usuario);
  res.render('postagens/show', {
    usuario: res.locals.usuario,
    isLoggedIn: res.locals.isLoggedIn,
    postagens: minhasPostagens,
    postagensJson: JSON.stringify(minhasPostagens)
  });
}));

// Detalhe de uma postagem específica
router.get('/postagens/:id', requireLogin, asyncHandler(postagemController.buscarPorId));

// ROTA DE EDIÇÃO DE POSTAGEM (renderiza o formulário edit.pug)
router.get('/postagens/:id/edit', requireLogin, asyncHandler(async (req, res) => {
  const postagem = await postagemController.buscarPorId({ params: { id: req.params.id } }, { raw: true });
  const categorias = await categoriaController.listar(req, { raw: true });
  const tags = await tagController.listar(req, { raw: true });
  if (!postagem) {
    return res.status(404).render('error', { error: 'Postagem não encontrada' });
  }
  res.render('postagens/edit', { post: postagem, categorias, tags, usuario: res.locals.usuario });
}));

// Criação, edição, remoção (POST, PUT, DELETE)
router.post('/postagens', requireLogin, asyncHandler(postagemController.criar));
router.put('/postagens/:id', requireLogin, asyncHandler(postagemController.atualizar));
router.delete('/postagens/:id', requireLogin, asyncHandler(postagemController.remover));

router.get('/secoes', requireLogin, asyncHandler(secaoController.listar));
router.get('/secoes-traducao', requireLogin, asyncHandler(secaoTraducaoController.listar));

router.get('/tags', requireLogin, asyncHandler(tagController.listar));
router.post('/tags', requireLogin, asyncHandler(tagController.criar));

router.get('/tags-traducao', requireLogin, asyncHandler(tagTraducaoController.listar));

router.get('/usuarios', requireLogin, asyncHandler(usuarioController.listar));
router.get('/usuarios/:id', requireLogin, asyncHandler(usuarioController.buscarPorId));
router.post('/usuarios', requireLogin, asyncHandler(usuarioController.criar));
router.put('/usuarios/:id', requireLogin, asyncHandler(usuarioController.atualizar));
router.delete('/usuarios/:id', requireLogin, asyncHandler(usuarioController.remover));

// Filtro por categoria (exibe postagens da categoria)
router.get('/categoria/:nome', asyncHandler(async (req, res) => {
  const categoria = await categoriaController.buscarPorNome(req.params.nome);
  if (!categoria) return res.status(404).render('error', { error: 'Categoria não encontrada' });
  const posts = await postagemController.listarPorCategoria(req, { raw: true, id_categoria: categoria.id_categoria });
  const [categorias, tags, grupos] = await Promise.all([
    categoriaController.listar(req, { raw: true }),
    tagController.listar(req, { raw: true }),
    grupoController.listar(req, { raw: true }),
  ]);
  res.render('index', {
    posts,
    categorias,
    tags,
    grupos,
    usuario: res.locals.usuario,
    isLoggedIn: res.locals.isLoggedIn
  });
}));

// Filtro por tag (exibe postagens da tag)
router.get('/tag/:nome', asyncHandler(async (req, res) => {
  const tag = await tagController.buscarPorNome(req.params.nome);
  if (!tag || !tag.id_tag) {
    return res.status(404).render('error', { error: 'Tag não encontrada ou inválida' });
  }
  const posts = await postagemController.listarPorTag(req, { raw: true, id_tag: tag.id_tag });
  const [categorias, tags, grupos] = await Promise.all([
    categoriaController.listar(req, { raw: true }),
    tagController.listar(req, { raw: true }),
    grupoController.listar(req, { raw: true }),
  ]);
  res.render('index', {
    posts,
    categorias,
    tags,
    grupos,
    usuario: res.locals.usuario,
    isLoggedIn: res.locals.isLoggedIn
  });
}));

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

router.use(async (req, res, next) => {
  res.locals.isLoggedIn = !!req.session.isLoggedIn;
  if (req.session.userId) {
    // Busca o usuário logado e injeta nas views
    res.locals.usuario = await Usuario.findByPk(req.session.userId);
  } else {
    res.locals.usuario = null;
  }
  next();
});

async function getLocationFromLatLng(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.address ? `${data.address.city || data.address.town || data.address.village || ''}, ${data.address.state || ''}` : '';
}

module.exports = router;
