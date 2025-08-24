const { MembroGrupo, Grupo, Usuario } = require('../models');

// Listar todos os membros de grupo
exports.listar = async (req, res) => {
  const membros = await MembroGrupo.findAll({
    include: [
      { model: Grupo, as: 'grupo' },
      { model: Usuario, as: 'usuario' }
    ]
  });
  res.json(membros);
};

// Buscar membro por ID
exports.buscarPorId = async (req, res) => {
  const membro = await MembroGrupo.findByPk(req.params.id, {
    include: [
      { model: Grupo, as: 'grupo' },
      { model: Usuario, as: 'usuario' }
    ]
  });
  if (!membro) return res.status(404).json({ error: 'Membro não encontrado' });
  res.json(membro);
};

// Criar novo membro de grupo
exports.criar = async (req, res) => {
  try {
    const novoMembro = await MembroGrupo.create(req.body);
    res.status(201).json(novoMembro);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar membro: ' + err.message });
  }
};

// Atualizar membro de grupo
exports.atualizar = async (req, res) => {
  const membro = await MembroGrupo.findByPk(req.params.id);
  if (!membro) return res.status(404).json({ error: 'Membro não encontrado' });
  await membro.update(req.body);
  res.json(membro);
};

// Remover membro de grupo
exports.remover = async (req, res) => {
  const membro = await MembroGrupo.findByPk(req.params.id);
  if (!membro) return res.status(404).json({ error: 'Membro não encontrado' });
  await membro.destroy();
  res.json({ mensagem: 'Membro removido com sucesso' });
};
