const { Grupo, Usuario, MembroGrupo } = require('../models');

// Listar todos os grupos
exports.listar = async (req, res) => {
  try {
    const grupos = await Grupo.findAll({
      include: [
        { model: Usuario, as: 'administrador' },
        { model: MembroGrupo, as: 'membros' }
      ]
    });
    res.json(grupos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar grupos', details: err.message });
  }
};

// Buscar grupo por ID
exports.buscarPorId = async (req, res) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'administrador' },
        { model: MembroGrupo, as: 'membros' }
      ]
    });
    if (!grupo) return res.status(404).json({ error: 'Grupo não encontrado' });
    res.json(grupo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar grupo', details: err.message });
  }
};

// Criar novo grupo
exports.criar = async (req, res) => {
  try {
    const novo = await Grupo.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar grupo', details: err.message });
  }
};

// Atualizar grupo
exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Grupo.update(req.body, {
      where: { id_grupo: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Grupo não encontrado' });
    const grupoAtualizado = await Grupo.findByPk(req.params.id);
    res.json(grupoAtualizado);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar grupo', details: err.message });
  }
};

// Remover grupo
exports.remover = async (req, res) => {
  try {
    const deleted = await Grupo.destroy({
      where: { id_grupo: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Grupo não encontrado' });
    res.json({ message: 'Grupo removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover grupo', details: err.message });
  }
};