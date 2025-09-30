const express = require('express');
const path = require('path');
const router = express.Router();
const { Usuario, Comentario, Curtida, Postagem, Evento, Grupo, ParticipanteEvento, Amizade } = require('../models');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const controllers = require('../controllers/index.js');
const {
  categoriaController,
  tagController,
  grupoController,
  postagemController, // <--- Adicione isso
} = controllers;
const { usuarioController } = require('../controllers');
// Wrapper para async/await
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware global para usuário logado
router.use(async (req, res, next) => {
  res.locals.isLoggedIn = !!req.session.isLoggedIn;
  if (req.session.userId) {
    res.locals.usuario = await Usuario.findByPk(req.session.userId);
  } else {
    res.locals.usuario = null;
  }
  next();
});

// Página inicial (SEM filtro por query string)
router.get('/', asyncHandler(async (req, res) => {
  let posts = await postagemController.listar(req, { raw: true });
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
    isLoggedIn: res.locals.isLoggedIn,
    gerarUrlPerfilOutro: usuarioController.gerarUrlPerfilOutro,
    gerarUrlPerfilProprio: usuarioController.gerarUrlPerfilProprio
    // Remova categoriaSelecionada e tagSelecionada
  });
}));

// Rotas de autenticação
router.get('/cadastro', (req, res) => res.render('cadastro'));
router.get('/login', (req, res) => res.render('login'));
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});
router.post('/login', usuarioController.login);

// Servir imagens de perfil de usuário, grupos e postagens como estático
router.use('/perfis', express.static(path.join(__dirname, '../perfis')));
router.use('/grupos/public', express.static(path.join(__dirname, '../grupos/public')));
router.use('/grupos/private', express.static(path.join(__dirname, '../grupos/private')));
router.use('/post', express.static(path.join(__dirname, '../post')));
router.use('/images', express.static(path.join(__dirname, '../images')));

// Importação dos módulos de rota (cada um em seu arquivo)
router.use('/usuarios', require('./usuarios'));
router.use('/postagens', require('./postagens'));
router.use('/categorias', require('./categorias'));
router.use('/tags', require('./tags'));
router.use('/grupos', require('./grupos'));
router.use('/administradores', require('./administradores'));
router.use('/amizades', require('./amizades'));
router.use('/comentarios', require('./comentarios'));
router.use('/compartilhamentos', require('./compartilhamentos'));
router.use('/curtidas', require('./curtidas'));
router.use('/documentos-verificacao', require('./documentosVerificacao'));
router.use('/eventos', require('./eventos'));
router.use('/idiomas', require('./idiomas'));
router.use('/membros-grupo', require('./membrosGrupo'));
router.use('/mensagens-diretas', require('./mensagensDiretas'));
router.use('/notificacoes', require('./notificacoes'));
router.use('/participantes-evento', require('./participantesEvento'));
router.use('/secoes', require('./secoes'));
router.use('/secoes-traducao', require('./secoesTraducao'));
router.use('/categorias-traducao', require('./categoriasTraducao'));
router.use('/tags-traducao', require('./tagsTraducao'));
router.use('/esqueciminhasenha', require('./esqueciminhasenha'));
router.use('/feed', require('./feed'));

// Função utilitária para converter lat/lng em endereço
async function getLocationFromLatLng(lat, lng) {
  if (!lat || !lng) return '';
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
  const res = await fetch(url);
  const data = await res.json();
  // Retorna apenas estado e país para privacidade
  const estado = data.address?.state || '';
  const pais = data.address?.country || '';
  return [estado, pais].filter(Boolean).join(', ');
}

// Rota do feed de postagens
router.get('/feed', asyncHandler(async (req, res) => {
  const { categoria, tag } = req.query;
  let posts;
  if (categoria && tag) {
    posts = await postagemController.listarPorCategoriaETag(req, { id_categoria: categoria, id_tag: tag, raw: true });
  } else if (categoria) {
    posts = await postagemController.listarPorCategoria(req, { id_categoria: categoria, raw: true });
  } else if (tag) {
    posts = await postagemController.listarPorTag(req, { id_tag: tag, raw: true });
  } else {
    posts = await postagemController.listar(req, { raw: true });
  }

  // Para cada postagem, converte lat/lng em endereço
  for (const post of posts) {
    if (post.latitude && post.longitude) {
      post.endereco = await getLocationFromLatLng(post.latitude, post.longitude);
    } else {
      post.endereco = '';
    }
  }

  const [categorias, tags] = await Promise.all([
    categoriaController.listar(req, { raw: true }),
    tagController.listar(req, { raw: true })
  ]);

  res.render('feed', {
    posts,
    categorias,
    tags,
    usuario: res.locals.usuario,
    isLoggedIn: res.locals.isLoggedIn
  });
}));

// Função utilitária (se necessário)
async function getLocationFromLatLng(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.address ? `${data.address.city || data.address.town || data.address.village || ''}, ${data.address.state || ''}` : '';
}

// API para filtro dinâmico de postagens
router.get('/api/postagens', asyncHandler(async (req, res) => {
  const { categoria, tag } = req.query;
  let posts;
  if (categoria && tag) {
    posts = await postagemController.listarPorCategoriaETag(req, { id_categoria: categoria, id_tag: tag, raw: true });
  } else if (categoria) {
    posts = await postagemController.listarPorCategoria(req, { id_categoria: categoria, raw: true });
  } else if (tag) {
    posts = await postagemController.listarPorTag(req, { id_tag: tag, raw: true });
  } else {
    posts = await postagemController.listar(req, { raw: true });
  }
  res.json(posts);
}));

// Incrementa visualização
router.post('/api/postagens/:id/visualizar', asyncHandler(async (req, res) => {
  const post = await Postagem.findByPk(req.params.id);
  if (post) {
    post.visualizacoes = (post.visualizacoes || 0) + 1;
    await post.save();
    return res.json({ visualizacoes: post.visualizacoes });
  }
  res.status(404).json({ error: 'Postagem não encontrada' });
}));

// Adiciona curtida
router.post('/api/postagens/:id/curtir', asyncHandler(async (req, res) => {
  const id_usuario = req.session.userId;
  if (!id_usuario) return res.status(401).json({ error: 'Precisa estar logado' });
  const id_postagem = req.params.id;
  // Verifica se já curtiu
  const curtidaExistente = await Curtida.findOne({ where: { id_postagem, id_usuario } });
  if (curtidaExistente) {
    return res.json({ sucesso: false, ja_curtiu: true });
  }
  await Curtida.create({ id_postagem, id_usuario });
  // Opcional: incrementa contador na postagem
  const post = await Postagem.findByPk(id_postagem);
  if (post) {
    post.curtidas = (post.curtidas || 0) + 1;
    await post.save();
  }
  res.json({ sucesso: true });
}));

// Adiciona comentário
router.post('/api/postagens/:id/comentar', asyncHandler(async (req, res) => {
  const id_usuario = req.session.userId;
  if (!id_usuario) return res.status(401).json({ error: 'Precisa estar logado' });
  const id_postagem = req.params.id;
  const { conteudo } = req.body;
  if (!conteudo) return res.status(400).json({ error: 'Conteúdo obrigatório' });
  await Comentario.create({
    id_postagem,
    id_autor: id_usuario,
    conteudo
  });
  res.json({ sucesso: true });
}));

// Alterna curtida (adiciona ou remove)
router.post('/api/postagens/:id/curtir-toggle', asyncHandler(async (req, res) => {
  const id_usuario = req.session.userId;
  if (!id_usuario) return res.status(401).json({ error: 'Precisa estar logado' });
  const id_postagem = req.params.id;
  const curtidaExistente = await Curtida.findOne({ where: { id_postagem, id_usuario } });

  if (curtidaExistente) {
    await curtidaExistente.destroy();
    // Conta o número atualizado de curtidas
    const curtidas = await Curtida.count({ where: { id_postagem } });
    return res.json({ sucesso: true, removido: true, curtidas });
  } else {
    await Curtida.create({ id_postagem, id_usuario });
    // Conta o número atualizado de curtidas
    const curtidas = await Curtida.count({ where: { id_postagem } });
    return res.json({ sucesso: true, adicionado: true, curtidas });
  }
}));

// Retorna dados atualizados da postagem (inclui curtidas)
router.get('/api/postagens/:id', asyncHandler(async (req, res) => {
  const post = await Postagem.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: 'Postagem não encontrada' });
  // Conta as curtidas no banco
  const curtidas = await Curtida.count({ where: { id_postagem: req.params.id } });
  res.json({
    curtidas: curtidas || 0,
    visualizacoes: post.visualizacoes || 0
  });
}));

// Rota para estatísticas principais (corrigida para usar o modelo Amizade diretamente)
router.get('/stats', asyncHandler(async (req, res) => {
  try {
    const [totalUsers, totalEvents, totalGroups] = await Promise.all([
      Usuario.count({ where: { ativo: true } }),
      Evento.count({ where: { ativo: true } }),
      Grupo.count({ where: { ativo: true } })
    ]);
    // Conexões = número de amizades aceitas
    const totalConnections = await Amizade.count({ where: { status_amizade: 'accepted' } });
    res.json({
      users: totalUsers,
      events: totalEvents,
      groups: totalGroups,
      totalUsers,
      totalEvents,
      totalGroups,
      totalConnections
    });
  } catch (err) {
    console.error('[STATS][ERROR]', err);
    res.status(500).json({ error: 'Erro ao buscar estatísticas', details: err.message });
  }
}));

// API: Atividades recentes (exemplo: últimos eventos, grupos, usuários)
router.get('/api/recent-activity', asyncHandler(async (req, res) => {
  const [recentEvents, recentGroups, recentUsers] = await Promise.all([
    Evento.findAll({ order: [['data_criacao', 'DESC']], limit: 3 }),
    Grupo.findAll({ order: [['data_criacao', 'DESC']], limit: 3 }),
    Usuario.findAll({ where: { ativo: true }, order: [['data_criacao', 'DESC']], limit: 3 })
  ]);
  const activities = [
    ...recentEvents.map(ev => ({
      type: 'event',
      title: 'Novo evento criado',
      description: ev.titulo_evento,
      createdAt: ev.data_criacao
    })),
    ...recentGroups.map(gr => ({
      type: 'group',
      title: 'Novo grupo formado',
      description: gr.nome_grupo,
      createdAt: gr.data_criacao
    })),
    ...recentUsers.map(u => ({
      type: 'user',
      title: 'Novo usuário',
      description: u.nome_usuario,
      createdAt: u.data_criacao
    }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  res.json(activities);
}));

// API: Próximos eventos (ordem por data)
router.get('/api/upcoming-events', asyncHandler(async (req, res) => {
  const events = await Evento.findAll({
    where: { ativo: true },
    order: [['data_inicio', 'ASC']],
    limit: 5
  });
  // Busca número de participantes para cada evento
  const result = await Promise.all(events.map(async ev => {
    const attendees = await ParticipanteEvento.count({ where: { id_evento: ev.id_evento } });
    return {
      title: ev.titulo_evento,
      location: ev.local_evento || ev.endereco_evento || 'Online',
      date: ev.data_inicio,
      attendees
    };
  }));
  res.json(result);
}));

// API: Comentários de uma postagem
router.get('/api/postagens/:id/comentarios', asyncHandler(async (req, res) => {
  const comentarios = await Comentario.findAll({
    where: { id_postagem: req.params.id },
    include: [
      { model: Usuario, as: 'autor', attributes: ['id_usuario', 'nome_usuario', 'foto_perfil'] }
    ],
    order: [['data_criacao', 'ASC']]
  });
  res.json(comentarios);
}));

module.exports = router;