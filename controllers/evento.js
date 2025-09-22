const { Evento, Usuario, Categoria, ParticipanteEvento } = require('../models');

exports.listar = async (req, res) => {
  const eventos = await Evento.findAll({
    include: [
      { model: Usuario, as: 'organizador' },
      { model: Categoria, as: 'categoria' },
      { model: ParticipanteEvento, as: 'participantes' }
    ]
  });
  res.json(eventos);
};

exports.buscarPorId = async (req, res) => {
  const evento = await Evento.findByPk(req.params.id, {
    include: [
      { model: Usuario, as: 'organizador' },
      { model: Categoria, as: 'categoria' },
      { model: ParticipanteEvento, as: 'participantes' }
    ]
  });
  if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
  res.json(evento);
};

exports.criar = async (req, res) => {
  try {
    const {
      titulo_evento,
      descricao_evento,
      data_inicio,
      data_fim,
      endereco_evento,
      local_evento,
      tipo_evento,
      link_online,
      id_categoria,
      max_participantes,
      latitude,
      longitude
    } = req.body;

    // Organizador é o usuário logado
    const id_organizador = req.session.userId;

    const novoEvento = await Evento.create({
      titulo_evento,
      descricao_evento,
      data_inicio,
      data_fim,
      endereco_evento, // endereco_evento já vem montado do formulário
      local_evento,
      tipo_evento,
      link_online,
      id_categoria,
      max_participantes,
      latitude,
      longitude,
      id_organizador,
      ativo: true
    });

    res.redirect('/eventos');
  } catch (err) {
    res.status(500).render('error', { error: 'Erro ao criar evento: ' + err.message });
  }
};

exports.atualizar = async (req, res) => {
  const evento = await Evento.findByPk(req.params.id);
  if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
  await evento.update(req.body);
  res.json(evento);
};

exports.remover = async (req, res) => {
  const evento = await Evento.findByPk(req.params.id);
  if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
  await evento.destroy();
  res.json({ mensagem: 'Evento removido com sucesso' });
};
