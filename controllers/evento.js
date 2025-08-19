const { Evento, Usuario, Categoria, ParticipanteEvento } = require('../models');

// Listar todos os eventos
exports.listar = async (req, res) => {
  try {
    const eventos = await Evento.findAll({
      include: [
        { model: Usuario, as: 'organizador' },
        { model: Categoria, as: 'categoria' },
        { model: ParticipanteEvento, as: 'participantes' }
      ]
    });
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar eventos', details: err.message });
  }
};

// Buscar evento por ID
exports.buscarPorId = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'organizador' },
        { model: Categoria, as: 'categoria' },
        { model: ParticipanteEvento, as: 'participantes' }
      ]
    });
    if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json(evento);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar evento', details: err.message });
  }
};

// Criar novo evento
exports.criar = async (req, res) => {
  try {
    const novo = await Evento.create(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar evento', details: err.message });
  }
};

// Atualizar evento
exports.atualizar = async (req, res) => {
  try {
    const [updated] = await Evento.update(req.body, {
      where: { id_evento: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Evento não encontrado' });
    const eventoAtualizado = await Evento.findByPk(req.params.id);
    res.json(eventoAtualizado);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar evento', details: err.message });
  }
};

// Remover evento
exports.remover = async (req, res) => {
  try {
    const deleted = await Evento.destroy({
      where: { id_evento: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json({ message: 'Evento removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover evento', details: err.message });
  }
};