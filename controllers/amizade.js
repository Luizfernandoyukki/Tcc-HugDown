const { Amizade, Usuario } = require('../models');

exports.listar = async (req, res) => {
  const amizades = await Amizade.findAll({
    include: [
      { model: Usuario, as: 'solicitante' },
      { model: Usuario, as: 'destinatario' }
    ]
  });
  res.json(amizades);
};

exports.buscarPorId = async (req, res) => {
  const amizade = await Amizade.findByPk(req.params.id, {
    include: [
      { model: Usuario, as: 'solicitante' },
      { model: Usuario, as: 'destinatario' }
    ]
  });
  if (!amizade) return res.status(404).json({ error: 'Amizade não encontrada' });
  res.json(amizade);
};

exports.criar = async (req, res) => {
  try {
    const { id_solicitante, id_destinatario, status_amizade } = req.body;
    // Validação dos campos obrigatórios
    if (!id_solicitante || !id_destinatario) {
      return res.status(400).json({ error: 'Preencha id_solicitante e id_destinatario.' });
    }
    // Cria a amizade
    const nova = await Amizade.create({
      id_solicitante,
      id_destinatario,
      status_amizade: status_amizade || 'pending'
    });
    res.status(201).json(nova);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar amizade: ' + err.message });
  }
};

exports.atualizar = async (req, res) => {
  const amizade = await Amizade.findByPk(req.params.id);
  if (!amizade) return res.status(404).json({ error: 'Amizade não encontrada' });
  await amizade.update(req.body);
  res.json(amizade);
};

exports.remover = async (req, res) => {
  const amizade = await Amizade.findByPk(req.params.id);
  if (!amizade) return res.status(404).json({ error: 'Amizade não encontrada' });
  await amizade.destroy();
  res.json({ mensagem: 'Amizade removida com sucesso' });
};
