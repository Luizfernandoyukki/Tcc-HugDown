const { Compartilhamento, Postagem, Usuario } = require('../models');

// Listar todos os compartilhamentos
exports.listar = async (req, res) => {
  try {
    const compartilhamentos = await Compartilhamento.findAll({
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    res.json(compartilhamentos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar compartilhamentos', details: err.message });
  }
};

// Buscar compartilhamento por ID
exports.buscarPorId = async (req, res) => {
  try {
    const compartilhamento = await Compartilhamento.findByPk(req.params.id, {
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    if (!compartilhamento) return res.status(404).json({ error: 'Compartilhamento não encontrado' });
    res.json(compartilhamento);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar compartilhamento', details: err.message });
  }
};

// Criar novo compartilhamento
exports.criar = async (req, res) => {
  try {
    const novo = await Compartilhamento.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar compartilhamento', details: err.message });
  }
};

// Atualizar compartilhamento
exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Compartilhamento.update(req.body, {
      where: { id_compartilhamento: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Compartilhamento não encontrado' });
    const compartilhamentoAtualizado = await Compartilhamento.findByPk(req.params.id);
    res.json(compartilhamentoAtualizado);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar compartilhamento', details: err.message });
  }
};

// Remover compartilhamento
exports.remover = async (req, res) => {
  try {
    const deleted = await Compartilhamento.destroy({
      where: { id_compartilhamento: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Compartilhamento não encontrado' });
    res.json({ message: 'Compartilhamento removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover compartilhamento', details: err.message });
  }
  };