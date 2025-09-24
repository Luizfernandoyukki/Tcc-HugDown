const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Carregue todos os models em uma variável só
const models = require('../models');
const requireLogin = require('../middlewares/auth');

// Use os models a partir do objeto models
const { Grupo, Usuario, MembroGrupo, Secao, PostagemSecao, Postagem } = models;

// Configuração do Multer para salvar imagens em subpastas conforme privacidade
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let tipo = req.body.tipo_privacidade || 'public';
    let pasta = path.join(__dirname, '..', 'grupos', tipo);
    fs.mkdirSync(pasta, { recursive: true });
    cb(null, pasta);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nome = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, nome);
  }
});
const upload = multer({ storage });

// Multer para uploads de postagens em sessão de grupo
const storagePost = multer.diskStorage({
  destination: async function (req, file, cb) {
    // Descobre o tipo de privacidade do grupo
    const grupo = await Grupo.findByPk(req.params.id);
    let tipo = grupo ? grupo.tipo_privacidade : 'public';
    let pasta = path.join(__dirname, '..', 'grupos', tipo);
    fs.mkdirSync(pasta, { recursive: true });
    cb(null, pasta);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nome = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, nome);
  }
});
const uploadPost = multer({ storage: storagePost });

// Exibir formulário de criação de grupo (GET /grupos/create)
// *** ESTA ROTA DEVE VIR ANTES DE /:id ***
router.get('/create', requireLogin, async (req, res) => {
  res.render('grupos/create');
});

// Listar todos os grupos e mostrar a tela de visualização (show)
router.get('/', requireLogin, async (req, res) => {
  const grupos = await Grupo.findAll({
    include: [
      { model: Usuario, as: 'administrador' },
      { model: MembroGrupo, as: 'membros' }
    ]
  });
  res.render('grupos/show', { grupos, grupo: null });
});

// Página interna do grupo (index do grupo)
router.get('/:id/index', requireLogin, async (req, res) => {
  const grupo = await Grupo.findByPk(req.params.id, {
    include: [
      { model: Usuario, as: 'administrador' },
      { model: MembroGrupo, as: 'membros' }
    ]
  });
  // Busca a seção exclusiva do grupo
  const secaoGrupo = await Secao.findOne({ where: { id_grupo: grupo.id_grupo, ativo: true } });
  let postagens = [];
  if (secaoGrupo) {
    // Busca postagens da seção do grupo
    const postagensSecao = await PostagemSecao.findAll({ where: { id_secao: secaoGrupo.id_secao } });
    const idsPostagens = postagensSecao.map(ps => ps.id_postagem);
    postagens = await Postagem.findAll({
      where: { id_postagem: idsPostagens, ativo: true },
      include: [{ model: Usuario, as: 'autor' }]
    });
  }
  res.render('grupos/index', { grupo, usuario: req.user, postagens });
});

// Visualizar um grupo específico (detalhe)
router.get('/:id', requireLogin, async (req, res) => {
  const grupos = await Grupo.findAll({
    include: [
      { model: Usuario, as: 'administrador' },
      { model: MembroGrupo, as: 'membros' }
    ]
  });
  const grupo = await Grupo.findByPk(req.params.id, {
    include: [
      { model: Usuario, as: 'administrador' },
      { model: MembroGrupo, as: 'membros' }
    ]
  });

  // Use sempre res.locals.usuario para garantir consistência
  const usuarioLogado = req.user || res.locals.usuario;
  let usuarioEhMembro = false;
  if (usuarioLogado && grupo && grupo.membros) {
    for (let i = 0; i < grupo.membros.length; i++) {
      if (grupo.membros[i].id_usuario == usuarioLogado.id_usuario) {
        usuarioEhMembro = true;
        break;
      }
    }
  }
  if (usuarioEhMembro) {
    return res.redirect(`/grupos/${grupo.id_grupo}/index`);
  }

  // Passe o usuário explicitamente para o template
  res.render('grupos/show', { grupos, grupo, usuario: usuarioLogado });
});

// Criar novo grupo (POST /grupos)
router.post('/', requireLogin, upload.single('foto_grupo'), async (req, res) => {
  try {
    console.log('[GRUPOS] Iniciando criação de grupo');
    // Determina o id do usuário logado
    const id_administrador = req.user?.id_usuario || req.session?.userId;
    console.log('[GRUPOS] id_administrador:', id_administrador);
    if (!id_administrador) {
      console.log('[GRUPOS] Usuário não autenticado');
      return res.status(401).send('Usuário não autenticado');
    }

    // Caminho da imagem salva
    let fotoPath = null;
    if (req.file) {
      fotoPath = path.join(
        '/grupos',
        req.body.tipo_privacidade || 'public',
        req.file.filename
      ).replace(/\\/g, '/');
      console.log('[GRUPOS] Foto salva em:', fotoPath);
    }

    // Cria o grupo
    const grupo = await Grupo.create({
      nome_grupo: req.body.nome_grupo,
      descricao_grupo: req.body.descricao_grupo || null,
      foto_grupo: fotoPath,
      tipo_privacidade: req.body.tipo_privacidade,
      id_administrador: id_administrador,
      ativo: true
      // data_criacao é automática
    });
    console.log('[GRUPOS] Grupo criado:', grupo.id_grupo);

    // Cria seção exclusiva para o grupo
    const secaoGrupo = await Secao.create({
      nome_secao: `Sessão do grupo ${grupo.nome_grupo}`,
      descricao_secao: `Postagens exclusivas do grupo ${grupo.nome_grupo}`,
      id_grupo: grupo.id_grupo,
      ativo: true
    });

    // Adiciona o criador como membro admin do grupo
    await MembroGrupo.create({
      id_grupo: grupo.id_grupo,
      id_usuario: id_administrador,
      papel_membro: 'admin',
      ativo: true
      // data_entrada é automática
    });
    console.log('[GRUPOS] Criador adicionado como membro admin do grupo');

    res.redirect('/grupos');
  } catch (err) {
    console.error('[GRUPOS][ERRO] Erro ao criar grupo:', err);
    res.status(500).send('Erro ao criar grupo: ' + err.message);
  }
});

// Participar de um grupo (POST /grupos/:id/participar)
router.post('/:id/participar', requireLogin, async (req, res) => {
  try {
    const id_grupo = req.params.id;
    const id_usuario = req.user?.id_usuario || req.session?.userId;
    console.log('[GRUPOS] Usuário tentando participar:', id_usuario, 'do grupo:', id_grupo);
    // Verifica se já é membro
    const jaMembro = await MembroGrupo.findOne({ where: { id_grupo, id_usuario } });
    if (!jaMembro) {
      await MembroGrupo.create({
        id_grupo,
        id_usuario,
        papel_membro: 'member',
        ativo: true
        // data_entrada é automática
      });
      console.log('[GRUPOS] Usuário adicionado como membro do grupo');
    } else {
      console.log('[GRUPOS] Usuário já é membro do grupo');
    }
    res.redirect(`/grupos/${id_grupo}`);
  } catch (err) {
    console.error('[GRUPOS][ERRO] Erro ao participar do grupo:', err);
    res.status(500).send('Erro ao participar do grupo: ' + err.message);
  }
});

// Criar postagem exclusiva do grupo (POST /grupos/:id/posts)
router.post('/:id/posts', requireLogin, upload.single('foto_post'), async (req, res) => {
  try {
    const id_grupo = req.params.id;
    const id_usuario = req.user?.id_usuario || req.session?.userId;

    // Busca a seção exclusiva do grupo
    const secaoGrupo = await Secao.findOne({ where: { id_grupo, ativo: true } });
    if (!secaoGrupo) return res.status(400).send('Seção do grupo não encontrada');

    // Cria a postagem
    const postagem = await Postagem.create({
      id_autor: id_usuario,
      tipo_postagem: 'text',
      conteudo: req.body.conteudo,
      privacidade: 'private', // só membros do grupo
      ativo: true
    });

    // Vincula a postagem à seção do grupo
    await PostagemSecao.create({
      id_postagem: postagem.id_postagem,
      id_secao: secaoGrupo.id_secao
    });

    res.redirect(`/grupos/${id_grupo}/index`);
  } catch (err) {
    res.status(500).send('Erro ao criar postagem no grupo: ' + err.message);
  }
});

// Exibir formulário de criação de postagem em sessão do grupo
router.get('/:id/criarpostagemsecao', requireLogin, async (req, res) => {
  const grupo = await Grupo.findByPk(req.params.id, {
    include: [
      { model: Usuario, as: 'administrador' },
      { model: MembroGrupo, as: 'membros' }
    ]
  });
  // Só membros podem acessar
  const usuarioLogado = req.user || res.locals.usuario;
  let usuarioEhMembro = false;
  if (usuarioLogado && grupo && grupo.membros) {
    for (let i = 0; i < grupo.membros.length; i++) {
      if (grupo.membros[i].id_usuario == usuarioLogado.id_usuario) {
        usuarioEhMembro = true;
        break;
      }
    }
  }
  if (!usuarioEhMembro) return res.status(403).send('Apenas membros do grupo podem postar');

  res.render('grupos/criarpostagemsecao', { grupo, usuario: usuarioLogado });
});

// Salvar postagem em sessão do grupo (com upload)
router.post('/:id/criarpostagemsecao', requireLogin, uploadPost.single('arquivo_post'), async (req, res) => {
  try {
    const id_grupo = req.params.id;
    const id_usuario = req.user?.id_usuario || req.session?.userId;

    // Busca a seção exclusiva do grupo
    const secaoGrupo = await Secao.findOne({ where: { id_grupo, ativo: true } });
    if (!secaoGrupo) return res.status(400).send('Seção do grupo não encontrada');

    // Caminho do arquivo salvo
    let url_midia = null;
    if (req.file) {
      // Exemplo: /grupos/public/arquivo.png
      url_midia = path.join(
        '/grupos',
        req.body.tipo_privacidade || 'public',
        req.file.filename
      ).replace(/\\/g, '/');
    }

    // Cria a postagem
    const postagem = await Postagem.create({
      id_autor: id_usuario,
      tipo_postagem: req.body.tipo_postagem || (url_midia ? 'photo' : 'text'),
      conteudo: req.body.conteudo,
      url_midia,
      privacidade: 'private', // só membros do grupo
      ativo: true
    });

    // Vincula a postagem à seção do grupo
    await PostagemSecao.create({
      id_postagem: postagem.id_postagem,
      id_secao: secaoGrupo.id_secao
    });

    res.redirect(`/grupos/${id_grupo}/index`);
  } catch (err) {
    res.status(500).send('Erro ao criar postagem no grupo: ' + err.message);
  }
});

// Armazena aprovações temporariamente em memória (substitua por banco se quiser persistência)
const aprovacoesExclusaoGrupo = {};

// Página de confirmação de exclusão do grupo
router.get('/:id/excluir', requireLogin, async (req, res) => {
  const grupo = await Grupo.findByPk(req.params.id, {
    include: [
      { model: MembroGrupo, as: 'membros', include: [{ model: Usuario, as: 'usuario' }] }
    ]
  });
  if (!grupo) return res.status(404).send('Grupo não encontrado');

  // Só administradores podem acessar
  const usuarioLogado = req.user || res.locals.usuario;
  const meusPapéis = grupo.membros.filter(m => m.id_usuario == usuarioLogado.id_usuario && m.papel_membro === 'admin');
  if (!meusPapéis.length) return res.status(403).send('Apenas administradores podem aprovar exclusão.');

  // Lista de administradores do grupo
  const admins = grupo.membros.filter(m => m.papel_membro === 'admin');
  // Quais já aprovaram
  const aprovados = (aprovacoesExclusaoGrupo[grupo.id_grupo] || []);
  res.render('grupos/confirmarExclusao', { grupo, admins, aprovados, usuario: usuarioLogado });
});

// Registrar aprovação do ADM para exclusão
router.post('/:id/excluir/aprovar', requireLogin, async (req, res) => {
  const grupoId = req.params.id;
  const usuarioId = req.user?.id_usuario || req.session?.userId;
  const grupo = await Grupo.findByPk(grupoId, {
    include: [{ model: MembroGrupo, as: 'membros' }]
  });
  if (!grupo) return res.status(404).send('Grupo não encontrado');
  const souAdm = grupo.membros.some(m => m.id_usuario == usuarioId && m.papel_membro === 'admin');
  if (!souAdm) return res.status(403).send('Apenas administradores podem aprovar exclusão.');

  // Marca aprovação
  aprovacoesExclusaoGrupo[grupoId] = aprovacoesExclusaoGrupo[grupoId] || [];
  if (!aprovacoesExclusaoGrupo[grupoId].includes(usuarioId)) {
    aprovacoesExclusaoGrupo[grupoId].push(usuarioId);
  }
  res.redirect(`/grupos/${grupoId}/excluir`);
});

// Excluir grupo se todos os ADMs aprovaram
router.post('/:id/excluir/definitivo', requireLogin, async (req, res) => {
  const grupoId = req.params.id;
  const grupo = await Grupo.findByPk(grupoId, {
    include: [{ model: MembroGrupo, as: 'membros' }]
  });
  if (!grupo) return res.status(404).send('Grupo não encontrado');
  const admins = grupo.membros.filter(m => m.papel_membro === 'admin');
  const aprovados = aprovacoesExclusaoGrupo[grupoId] || [];
  if (admins.length === 0 || aprovados.length < admins.length) {
    return res.status(403).send('Nem todos os administradores aprovaram a exclusão.');
  }
  await grupo.destroy();
  delete aprovacoesExclusaoGrupo[grupoId];
  res.redirect('/grupos');
});

// ...existing code for PUT, DELETE if needed...
module.exports = router;