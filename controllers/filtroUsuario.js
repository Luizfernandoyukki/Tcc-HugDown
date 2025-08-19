const { FiltroUsuario, Usuario } = require('../models');

// Listar todos os filtros de usuário
exports.listar = async (req, res) => {
  try {
    const filtros = await FiltroUsuario.findAll({
      include: [
        { model: Usuario, as: 'usuario' }
      ]
    });
    res.json(filtros);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar filtros de usuário', details: err.message });
  }
};

// Buscar filtro por ID
exports.buscarPorId = async (req, res) => {
  try {
    const filtro = await FiltroUsuario.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario' }
      ]
    });
    if (!filtro) return res.status(404).json({ error: 'Filtro não encontrado' });
    res.json(filtro);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar filtro', details: err.message });
  }
};

// Criar novo filtro de usuário
exports.criar = async (req, res) => {
  try {
    const novo = await FiltroUsuario.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar filtro', details: err.message });
  }
};

// Atualizar filtro de usuário
exports.atualizar = async (req, res) => {
  try {
    const [updated] = await FiltroUsuario.update(req.body, {
      where: { id_filtro: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Filtro não encontrado' });
    const filtroAtualizado = await FiltroUsuario.findByPk(req.params.id);
    res.json(filtroAtualizado);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar filtro', details: err.message });
  }
};

// Remover filtro de usuário
exports.remover = async (req, res) => {
  try {
    const deleted = await FiltroUsuario.destroy({
      where: { id_filtro: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Filtro não encontrado' });
    res.json({ message: 'Filtro removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover filtro', details: err.message });
  }
};