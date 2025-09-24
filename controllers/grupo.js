const { Grupo, Usuario, MembroGrupo } = require('../models');

// Listar todos os grupos
exports.listar = async (req, resOrOptions) => {
  const grupos = await Grupo.findAll({
    include: [
      { model: Usuario, as: 'administrador' },
      { model: MembroGrupo, as: 'membros' }
    ]
  });
  if (resOrOptions && resOrOptions.raw) return grupos;
  if (resOrOptions && typeof resOrOptions.json === 'function') return resOrOptions.json(grupos);
  return grupos;
};

// Buscar grupo por ID
exports.buscarPorId = async (req, res) => {
  const grupo = await Grupo.findByPk(req.params.id, {
    include: [
      { model: Usuario, as: 'administrador' },
      { model: MembroGrupo, as: 'membros' }
    ]
  });
  if (!grupo) return res.status(404).json({ error: 'Grupo não encontrado' });
  res.json(grupo);
};

// Criar novo grupo
exports.criar = async (req, res) => {
  try {
    const novoGrupo = await Grupo.create({
      nome_grupo: req.body.nome_grupo,
      descricao_grupo: req.body.descricao_grupo,
      foto_grupo: req.body.foto_grupo, // ajustar se for upload real
      tipo_privacidade: req.body.tipo_privacidade,
      id_administrador: req.user.id_usuario,
      max_participantes: req.body.max_participantes || null,
      id_categoria: req.body.id_categoria || null
    });
    return res.redirect('/grupos');
  } catch (err) {
    res.status(500).send('Erro ao criar grupo: ' + err.message);
  }
};

// Atualizar grupo
exports.atualizar = async (req, res) => {
  const grupo = await Grupo.findByPk(req.params.id);
  if (!grupo) return res.status(404).json({ error: 'Grupo não encontrado' });
  await grupo.update(req.body);
  res.json(grupo);
};

// Remover grupo
exports.remover = async (req, res) => {
  const grupo = await Grupo.findByPk(req.params.id);
  if (!grupo) return res.status(404).json({ error: 'Grupo não encontrado' });
  await grupo.destroy();
  res.json({ mensagem: 'Grupo removido com sucesso' });
};
