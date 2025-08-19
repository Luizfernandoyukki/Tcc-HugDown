const { Amizade, Usuario } = require('../models');

// Listar todas as amizades
exports.listar = async (req, res) => {
  try {
    const amizades = await Amizade.findAll({
      include: [
        { model: Usuario, as: 'solicitante' },
        { model: Usuario, as: 'destinatario' }
      ]
    });
    res.json(amizades);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar amizades', details: err.message });
  }
};

// Buscar amizade por ID
exports.buscarPorId = async (req, res) => {
  try {
    const amizade = await Amizade.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'solicitante' },
        { model: Usuario, as: 'destinatario' }
      ]
    });
    if (!amizade) return res.status(404).json({ error: 'Amizade não encontrada' });
    res.json(amizade);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar amizade', details: err.message });
  }
};

// Criar nova amizade
exports.criar = async (req, res) => {
  try {
    const nova = await Amizade.create(req.body);
    res.status(201).json(nova);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar amizade', details: err.message });
  }
};

// Atualizar amizade
exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Amizade.update(req.body, {
      where: { id_amizade: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Amizade não encontrada' });
    const amizadeAtualizada = await Amizade.findByPk(req.params.id);
    res.json(amizadeAtualizada);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar amizade', details: err.message });
  }
};

// Remover amizade
exports.remover = async (req, res) => {
  try {
    const deleted = await Amizade.destroy({
      where: { id_amizade: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Amizade não encontrada' });
    res.json({ message: 'Amizade removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover amizade', details: err.message});
  }
};