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
  return resOrOptions.json(grupos);
};

// Buscar grupo por ID
exports.buscarPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const grupo = await Grupo.findByPk(id, {
      include: [
        { model: Usuario, as: 'administrador' },
        { model: MembroGrupo, as: 'membros' }
      ]
    });
    if (!grupo) return res.status(404).json({ error: 'Grupo não encontrado' });
    res.json(grupo);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao buscar grupo' });
  }
};

// Criar novo grupo
exports.criar = async (req, res) => {
  try {
    const {
      id_administrador,
      nome_grupo,
      descricao_grupo,
      foto_grupo,
      tipo_privacidade,
      ativo
    } = req.body;
    // Validação dos campos obrigatórios
    if (!id_administrador || !nome_grupo) {
      return res.status(400).json({ error: 'Preencha id_administrador e nome_grupo.' });
    }
    const novo = await Grupo.create({
      id_administrador,
      nome_grupo,
      descricao_grupo,
      foto_grupo,
      tipo_privacidade: tipo_privacidade || 'public',
      ativo: ativo !== undefined ? ativo : true
    });
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao criar grupo' });
  }
};

// Atualizar grupo
exports.atualizar = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Grupo.update(req.body, {
      where: { id_grupo: id }
    });
    if (!updated) return res.status(404).json({ error: 'Grupo não encontrado' });
    const grupoAtualizado = await Grupo.findByPk(id, {
      include: [
        { model: Usuario, as: 'administrador' },
        { model: MembroGrupo, as: 'membros' }
      ]
    });
    res.json(grupoAtualizado);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao atualizar grupo' });
  }
};

// Remover grupo
exports.remover = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Grupo.destroy({
      where: { id_grupo: id }
    });
    if (!deleted) return res.status(404).json({ error: 'Grupo não encontrado' });
    res.json({ message: 'Grupo removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao remover grupo' });
  }
};
