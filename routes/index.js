const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const requireLogin = require('../middlewares/auth');

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

// ROTAS PÁGINA (renderizam HTML)
router.get('/', asyncHandler(async (req, res) => {
  const [posts, categorias, tags, grupos] = await Promise.all([
    postagemController.listar(req, { raw: true }),
    categoriaController.listar(req, { raw: true }),
    tagController.listar(req, { raw: true }),
    grupoController.listar(req, { raw: true }),
  ]);
  res.render('index', {
    posts,
    categorias,
    tags,
    grupos,
    usuario: req.user || null,
    usuarioLogado: !!req.user,
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
router.post('/cadastro', asyncHandler(usuarioController.criar));
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

router.get('/postagens', requireLogin, asyncHandler(postagemController.listar));
router.get('/postagens/:id', requireLogin, asyncHandler(postagemController.buscarPorId));
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
    usuario: req.user || null,
    usuarioLogado: !!req.user,
  });
}));

// Filtro por tag (exibe postagens da tag)
router.get('/tag/:nome', asyncHandler(async (req, res) => {
  // Busca a tag pelo nome
  const tag = await tagController.buscarPorNome(req.params.nome);
  console.log('DEBUG tag:', tag); // <-- Adicione este log

  if (!tag || !tag.id_tag) {
    return res.status(404).render('error', { error: 'Tag não encontrada ou inválida' });
  }

  // Busca as postagens dessa tag
  const posts = await postagemController.listarPorTag(req, { raw: true, id_tag: tag.id_tag });

  // Busca categorias, tags e grupos para o topo
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
    usuario: req.user || null,
    usuarioLogado: !!req.user,
  });
}));

module.exports = router;
