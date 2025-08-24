const { ParticipanteEvento, Evento, Usuario } = require('../models');

// Listar todos os participantes de eventos
exports.listar = async (req, res) => {
  const participantes = await ParticipanteEvento.findAll({
    include: [
      { model: Evento, as: 'evento' },
      { model: Usuario, as: 'usuario' }
    ]
  });
  res.json(participantes);
};

// Buscar participante de evento por ID
exports.buscarPorId = async (req, res) => {
  const participante = await ParticipanteEvento.findByPk(req.params.id, {
    include: [
      { model: Evento, as: 'evento' },
      { model: Usuario, as: 'usuario' }
    ]
  });
  if (!participante) return res.status(404).json({ error: 'Participante não encontrado' });
  res.json(participante);
};

// Criar novo participante de evento
exports.criar = async (req, res) => {
  try {
    const novoParticipante = await ParticipanteEvento.create(req.body);
    res.status(201).json(novoParticipante);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar participante: ' + err.message });
  }
};

// Atualizar participante de evento
exports.atualizar = async (req, res) => {
  const participante = await ParticipanteEvento.findByPk(req.params.id);
  if (!participante) return res.status(404).json({ error: 'Participante não encontrado' });
  await participante.update(req.body);
  res.json(participante);
};

// Remover participante de evento
exports.remover = async (req, res) => {
  const participante = await ParticipanteEvento.findByPk(req.params.id);
  if (!participante) return res.status(404).json({ error: 'Participante não encontrado' });
  await participante.destroy();
  res.json({ mensagem: 'Participante removido com sucesso' });
};
