const { FiltroUsuario, Usuario } = require('../models');

// Listar todos os filtros de usuário
exports.listar = async (req, res) => {
  try {
    const filtros = await FiltroUsuario.findAll({
      include: [{ model: Usuario, as: 'usuario' }]
    });
    res.json(filtros);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao listar filtros' });
  }
};

// Buscar filtro por ID
exports.buscarPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const filtro = await FiltroUsuario.findByPk(id, {
      include: [{ model: Usuario, as: 'usuario' }]
    });
    if (!filtro) return res.status(404).json({ error: 'Filtro não encontrado' });
    res.json(filtro);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao buscar filtro' });
  }
};

// Criar novo filtro de usuário
exports.criar = async (req, res) => {
  try {
    const novo = await FiltroUsuario.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao criar filtro' });
  }
};

// Atualizar filtro de usuário
exports.atualizar = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await FiltroUsuario.update(req.body, {
      where: { id_filtro: id }
    });
    if (!updated) return res.status(404).json({ error: 'Filtro não encontrado' });
    const filtroAtualizado = await FiltroUsuario.findByPk(id, {
      include: [{ model: Usuario, as: 'usuario' }]
    });
    res.json(filtroAtualizado);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao atualizar filtro' });
  }
};

// Remover filtro de usuário
exports.remover = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await FiltroUsuario.destroy({
      where: { id_filtro: id }
    });
    if (!deleted) return res.status(404).json({ error: 'Filtro não encontrado' });
    res.json({ message: 'Filtro removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Erro ao remover filtro' });
  }
};
