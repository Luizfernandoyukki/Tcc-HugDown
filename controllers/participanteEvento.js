const { ParticipanteEvento, Evento, Usuario } = require('../models');

// Listar todos os participantes de eventos
exports.listar = async (req, res) => {
  try {
    const participantes = await ParticipanteEvento.findAll({
      include: [
        { model: Evento, as: 'evento' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    res.json(participantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar participante de evento por ID
exports.buscarPorId = async (req, res) => {
  try {
    const participante = await ParticipanteEvento.findByPk(req.params.id, {
      include: [
        { model: Evento, as: 'evento' },
        { model: Usuario, as: 'usuario' }
      ]
    });
    if (!participante) {
      return res.status(404).json({ error: 'Participante não encontrado' });
    }
    res.json(participante);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar novo participante de evento
exports.criar = async (req, res) => {
  try {
    const novoParticipante = await ParticipanteEvento.create(req.body);
    res.status(201).json(novoParticipante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar participante de evento
exports.atualizar = async (req, res) => {
  try {
    const participante = await ParticipanteEvento.findByPk(req.params.id);
    if (!participante) {
      return res.status(404).json({ error: 'Participante não encontrado' });
    }
    await participante.update(req.body);
    res.json(participante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remover participante de evento
exports.remover = async (req, res) => {
  try {
    const participante = await ParticipanteEvento.findByPk(req.params.id);
    if (!participante) {
      return res.status(404).json({ error: 'Participante não encontrado' });
    }
    await participante.destroy();
    res.json({ mensagem: 'Participante removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};