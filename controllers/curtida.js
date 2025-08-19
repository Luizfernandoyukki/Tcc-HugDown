const { Curtida, Postagem, Usuario } = require('../models');

// Listar todas as curtidas
exports.listar = async (req, res) => {
  try {
    const curtidas = await Curtida.findAll({
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    res.json(curtidas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar curtidas', details: err.message });
  }
};

// Buscar curtida por ID
exports.buscarPorId = async (req, res) => {
  try {
    const curtida = await Curtida.findByPk(req.params.id, {
      include: [
        { model: Postagem, as: 'postagem' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    if (!curtida) return res.status(404).json({ error: 'Curtida não encontrada' });
    res.json(curtida);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar curtida', details: err.message });
  }
};

// Criar nova curtida
exports.criar = async (req, res) => {
  try {
    const nova = await Curtida.create(req.body);
    res.status(201).json(nova);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar curtida', details: err.message });
  }
};

// Remover curtida
exports.remover = async (req, res) => {
  try {
    const deleted = await Curtida.destroy({
      where: { id_curtida: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Curtida não encontrada' });
    res.json({ message: 'Curtida removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover curtida', details: err.message });
  }
};