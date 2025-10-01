const { Evento, Usuario, ParticipanteEvento } = require('../models');

exports.listar = async (req, res) => {
  try {
    const eventos = await Evento.findAll({
      include: [
        { model: Usuario, as: 'organizador' },
        { model: ParticipanteEvento, as: 'participantes' }
      ]
    });
    res.json(eventos);
  } catch (err) {
    console.error('[EVENTO][listar][ERRO]', err); // log detalhado
    if (process.env.NODE_ENV !== 'production') {
      res.status(500).json({ error: err.message, stack: err.stack });
    } else {
      res.status(500).json({ error: 'Erro ao buscar eventos.' });
    }
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'organizador' },
        { model: ParticipanteEvento, as: 'participantes' }
      ]
    });
    if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
    res.json(evento);
  } catch (err) {
    console.error('[EVENTO][buscarPorId][ERRO]', err);
    if (process.env.NODE_ENV !== 'production') {
      res.status(500).json({ error: err.message, stack: err.stack });
    } else {
      res.status(500).json({ error: 'Erro ao buscar evento.' });
    }
  }
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
      max_participantes,
      latitude,
      longitude,
      nome_categoria_evento // <-- garantir que está aqui
    } = req.body;

    // Organizador é o usuário logado
    const id_organizador = req.session.userId;

    const novoEvento = await Evento.create({
      titulo_evento,
      descricao_evento,
      data_inicio,
      data_fim,
      endereco_evento,
      local_evento,
      tipo_evento,
      link_online,
      max_participantes,
      latitude,
      longitude,
      nome_categoria_evento, // <-- garantir que está aqui
      id_organizador,
      ativo: true
    });

    res.redirect('/eventos');
  } catch (err) {
    console.error('[EVENTO][criar][ERRO]', err);
    if (process.env.NODE_ENV !== 'production') {
      res.status(500).render('error', { error: 'Erro ao criar evento: ' + err.message, stack: err.stack });
    } else {
      res.status(500).render('error', { error: 'Erro ao criar evento.' });
    }
  }
};

exports.atualizar = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
    await evento.update({
      ...req.body,
      nome_categoria_evento: req.body.nome_categoria_evento // <-- garantir que está aqui
    });
    res.json(evento);
  } catch (err) {
    console.error('[EVENTO][atualizar][ERRO]', err);
    if (process.env.NODE_ENV !== 'production') {
      res.status(500).json({ error: err.message, stack: err.stack });
    } else {
      res.status(500).json({ error: 'Erro ao atualizar evento.' });
    }
  }
};

exports.remover = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
    await evento.destroy();
    res.json({ mensagem: 'Evento removido com sucesso' });
  } catch (err) {
    console.error('[EVENTO][remover][ERRO]', err);
    if (process.env.NODE_ENV !== 'production') {
      res.status(500).json({ error: err.message, stack: err.stack });
    } else {
      res.status(500).json({ error: 'Erro ao remover evento.' });
    }
  }
};


